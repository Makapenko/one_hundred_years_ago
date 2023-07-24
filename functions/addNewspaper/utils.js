const fs = require('fs').promises;
const { URL } = require('url');
const domain = 'http://www.starosti.ru';

function extractTargetHtml(htmlContent) {
  const regex = /<\/h1><\/center><\/font>([\s\S]*?)<center><table border="1">/i;
  const match = regex.exec(htmlContent);
  return match ? match[1] : '';
}

function getHtmlParts(targetHtml) {
  const imgPattern = /<img[^>]*title=/g;
  const positions = [];
  let imgMatch;

  while ((imgMatch = imgPattern.exec(targetHtml)) !== null) {
    const position = imgMatch.index;
    if (position !== 0) {
      positions.push(position);
    }
  }

  return positions.map((position, index) => {
    if (index === 0) {
      return targetHtml.slice(0, position);
    }
    return targetHtml.slice(positions[index - 1], position);
  }).concat([targetHtml.slice(positions[positions.length - 1])]);
}

function extractImages(part) {
  const imgSrcPattern = /src=\/?["']?([^.]+(\.jpg|\.png))/g;
  const imagesInPart = [];
  let imgMatch;

  while ((imgMatch = imgSrcPattern.exec(part)) !== null) {
    const imgUrl = new URL(imgMatch[1].startsWith('/') ? imgMatch[1] : `/${imgMatch[1]}`, domain);
    imagesInPart.push(imgUrl.href);
  }

  return imagesInPart;
}

function cleanText(part) {
  const textWithLineBreaks = part.replace(/<\/(b|p|h2|h3)>/g, '\n');
  return textWithLineBreaks.replace(/<[^>]*>|&nbsp;/g, '');
}

function processHtmlParts(htmlParts) {
  return htmlParts.map(part => {
    const images = extractImages(part);
    const text = cleanText(part);

    return {
      images,
      text,
    };
  }).filter(partObject => partObject.images.length || partObject.text.trim().length);
}

async function saveArrayToFile(array, fileName) {
  try {
    await fs.writeFile(`notes/${fileName}`, JSON.stringify(array, null, 2));
    console.log(`Файл успешно сохранен: ${fileName}`);
  } catch (err) {
    console.error('Ошибка при сохранении файла:', err);
  }
}

module.exports = {
  extractTargetHtml,
  getHtmlParts,
  processHtmlParts,
  saveArrayToFile
};
