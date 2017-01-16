var Epub = require('epub'),
    config = require('./config.json'),
    htmlToText = require('html-to-text'),
    path = require('path'),
    fs = require('fs'),
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
        };

    epub.flow.forEach(function(chapter) {
        chapterList.push(chapter.id);
        // console.log(chapter.id);
    });
    for(i = 0; i<chapterList.length; i++) {
        chapterId = getChapterId(i, chapterList);
        epub.getChapter(chapterId, function(err, text) {
            convertToText(text, chapterObj);
            // console.log(text);
            // console.log(chapterObj.chapterText);
            writeText(chapterObj);
        });
    }
    console.log(chapterObj.chapterText);
    // console.log(epub.metadata.title);
    // epub.getChapter(chapterId, function(err, text) {
    // console.log(htmlText);
    // writeFile(text);
    // convertToText(text, chapterObj);
    // console.log(chapterObj.chapterText);
    // writeText(chapterObj);
    // });
});
epub.parse();

function getChapterId(count, chapterList) {
    var currentChap;

    currentChap = chapterList[count];
    // console.log(currentChap);
    // count = count + 1;
    return currentChap;
}

// function writeFile(htmlText) {
//     fs.writeFile(path.join(__dirname, 'htmltest.html'), htmlText, function(err) {
//         if (err) return console.log(err);
//         console.log('Wrote to htmltest.html');
//     });
// }

function convertToText(htmlText, chapterObj) {
    chapterObj.chapterText = htmlToText.fromString(htmlText, {
        wordwrap: 130
    });
    // console.log(chapterText);
}

function writeText(chapterObj) {
    fs.appendFile(path.join(__dirname, 'rawtext.txt'), chapterObj.chapterText, function(err) {
        if (err) return console.log(err);
        console.log('Wrote to rawtext.txt');
    });
}
