var Epub = require('epub'),
    config = require('./config.json'),
    htmlToText = require('html-to-text'),
    path = require('path'),
    fs = require('fs'),
    pdf = require('html-pdf'),
    epubfile = config.filepath,
    imagewebroot = config.imagewebroot,
    chapterwebroot = config.chapterwebroot,
    epub = new Epub(epubfile, imagewebroot, chapterwebroot);

epub.on("end", function() {
    // Use Epub
    var chapterId,
        chapterList = [],
        chapterObj = {
            chapterText: ""
        },
        imageName = "",
        imageNamesArray = [];

    epub.flow.forEach(function(chapter) {
        chapterList.push(chapter.id);
        // console.log(chapter.id);
    });
    for(i = 0; i<chapterList.length; i++) {
        chapterId = getChapterId(i, chapterList);
        epub.getChapterRaw(chapterId, function(err, text) {
            convertToText(text, chapterObj);
            // console.log(text);
            // console.log(chapterObj.chapterText);
            // writeText(chapterObj);
            writeHtml(text);
        });
    }
    console.log(chapterObj.chapterText);
    // console.log(epub.metadata.title);
    // for(i = 0; i<imagesArray.length; i++) {
        epub.getImage(imageName, function(error, img, mimeType) {
            if(error) return console.log(error);
            writeImage(img, imageName);
        });
    // }
});
epub.parse();

// createPdf();

function createPdf() {
    var html = fs.readFileSync(path.join(__dirname, 'htmlfile.html'), 'utf-8');
    var options = {
        // "format": 'Letter'
    };

    pdf.create(html, options).toFile(path.join(__dirname, 'pdffile.pdf'), function(err, res) {
        if(err) return console.log(err);
        console.log(res);
    });
}

function getChapterId(count, chapterList) {
    var currentChap;

    currentChap = chapterList[count];
    // console.log(currentChap);
    return currentChap;
}

function writeImage(img, imageName) {
    fs.writeFile(path.join(__dirname + '/images/', imageName), img, function(err) {
        if(err) return console.log(err);
        // console.log('Wrote to image.jpeg');
    });
}

function writeHtml(htmlText) {
    fs.appendFile(path.join(__dirname, 'htmlfile.html'), htmlText, function(err) {
        if(err) return console.log(err);
        // console.log('Wrote to htmltest.html');
    });
}

function convertToText(htmlText, chapterObj) {
    chapterObj.chapterText = htmlToText.fromString(htmlText, {
        wordwrap: 130
    });
    // console.log(chapterText);
}

function writeText(chapterObj) {
    fs.appendFile(path.join(__dirname, 'rawtext.txt'), chapterObj.chapterText, function(err) {
        if(err) return console.log(err);
        // console.log('Wrote to rawtext.txt');
    });
}
