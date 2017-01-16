var Epub = require('epub'),
    config = require('./config.json'),
    htmlToText = require('html-to-text'),
    path = require('path'),
    epubfile = config.filepath,
    imagewebroot = config.imagewebroot,
    chapterwebroot = config.chapterwebroot,
    epub = new Epub(epubfile, imagewebroot, chapterwebroot);

epub.on("end", function() {
    // epub is now usable
    var chapterId,
        chapterText,
        chapterList = [],
        count = 0,
        htmlText;

    epub.flow.forEach(function(chapter) {
        chapterList.push(chapter.id);
        // console.log(chapter.id);
    });

    chapterId = getChapterId(count, chapterList);
    // console.log(epub.metadata.title);
    epub.getChapter(chapterId, function(err, text) {
    htmlText = text;
    // console.log(htmlText);
    });
    // htmlText = htmlText.replace(/\n/g, "");
    chapterText = htmlToText.fromString(htmlText, {
    // chapterText = htmlToText.fromFile(path.join(__dirname, 'htmltest'), {
        wordwrap: 130
    // }, (err, text) => {
    //     if (err) return console.error(err);
    //     console.log(text);
    });
    console.log(chapterText);
});
epub.parse();

function getChapterId(count, chapterList) {
    var currentChap;

    currentChap = chapterList[5];
    console.log(currentChap);
    count = count + 1;
    return currentChap;
}
