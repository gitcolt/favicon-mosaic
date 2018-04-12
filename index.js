let img = new Image();
function getUserImage(file) {
    if (typeof file === 'undefined')
        img.src = 'https://s3.amazonaws.com/colten-my-images/santa.jpg';
    else
        img.src = window.URL.createObjectURL(file);
}

window.onload = function() {
    blocks.value = 10;
    b.innerHTML = blocks.value;
    let faviconStrip = new Image();
    faviconStrip.src = 'https://s3.amazonaws.com/colten-my-images/strip.png';
    let faviconStripIsLoaded = false;
    faviconStrip.onload = function() {
        faviconStripIsLoaded = true;
    };

    let canvasOriginalImage = canvas1.getContext('2d');
    let canvasPixelated = canvas2.getContext('2d');
    let canvasMosaic = canvas3.getContext('2d');

    let adjustedImageSize = {
        w: 0,
        h: 0
    };
    let xPos = 0;
    let yPos = 0;
    canvasPixelated.imageSmoothingEnabled = false;
    canvasPixelated.mozImageSmoothingEnabled = false;
    canvasPixelated.webkitImageSmoothingEnabled = false;

    window.URL = window.URL; 
    let fileElem = document.getElementById('fileElem');

    function onImageLoaded() {
        let wRatio = canvas2.width / img.width;
        let hRatio = canvas2.height / img.height;
        let ratio = Math.min(hRatio, wRatio);
        adjustedImageSize.w = img.width*ratio;
        adjustedImageSize.h = img.height*ratio;
        xPos = (canvas2.width - adjustedImageSize.w)/2;
        yPos = (canvas2.height - adjustedImageSize.h)/2;
        canvasOriginalImage.clearRect(0, 0, canvas1.width, canvas1.height);
        canvasOriginalImage.drawImage(img, 0, 0, img.width, img.height, xPos, yPos, adjustedImageSize.w, adjustedImageSize.h);

        pixelate();
        drawMosaic();
    };

    img.addEventListener('load', onImageLoaded);

    function pixelate() {
        let size = blocks.value / 4 * 0.01;
        let w = adjustedImageSize.w * size;
        let h = adjustedImageSize.h * size;
        canvasPixelated.clearRect(0, 0, canvas2.width, canvas2.height);


        canvasPixelated.drawImage(img, 0, 0, w, h);
        canvasPixelated.drawImage(canvas2, 0, 0, w, h, xPos, yPos, adjustedImageSize.w, adjustedImageSize.h);
    }

    function getPixel(x, y) {
        let temp = canvas2.toDataURL('image/jpg');
        let pixelImage = new Image();
        pixelImage.src = temp;
        canvasPixelated.drawImage(pixelImage, 0, 0, canvas2.width, canvas2.height);
        let pixel = canvasPixelated.getImageData(x, y, 1, 1).data;
        //console.log('r:' + pixel[0] + ' g:' + pixel[0] + ' b:' + pixel[0] +  ' a:' + pixel[3]);
        return pixel;

    }

    /* Returns the index of the best matching favicon */
    function getNearestFavicon(imgColor) {
        let bestDist = 9999;
        let bestIdx = -1;

        for (let i = 0; i < avgColors.length; i++) {
            let euclidianDist = Math.sqrt(Math.pow(avgColors[i].r - imgColor[0], 2) + 
                                Math.pow(avgColors[i].g - imgColor[1], 2) + Math.pow(avgColors[i].b - imgColor[2], 2) + Math.pow(avgColors[i].a - imgColor[3], 2));
            if (euclidianDist < bestDist) {
                bestDist = euclidianDist;
                bestIdx = i;
            }
        }
        
       return bestIdx; 
    };

    /* Draws the i'th favicon from the top to the x and y mosaic tile coords */
    function drawFavicon(i, x, y) {
        canvasMosaic.drawImage(faviconStrip, 0, i*16, 16, 16, x, y, canvas2.width/blocks.value, canvas2.height/blocks.value);
    };

    /* Samples the pixelated image to get the mosaic tile colors, then
        draws the closest-colored favicon to the appropriate tile position */
    function drawMosaic() {
        canvasMosaic.clearRect(0, 0, canvas2.width, canvas2.height);
        for (let j = 0; j < blocks.value; j++) {
            for (let i = 0; i < blocks.value; i++) {
                let block = {
                    x: i * (canvas2.width/blocks.value) + xPos,
                    y: j * (canvas2.height/blocks.value) + yPos
                };
                if (block.x >= (xPos + adjustedImageSize.w) || block.y >= (yPos + adjustedImageSize.h)) { return; }
                let color = getPixel(block.x + 1, block.y + 1);
                let idx = getNearestFavicon(color);
                drawFavicon(idx, block.x, block.y);
            }
        }
    }

    getUserImage();
    
    blocks.addEventListener('change', function() {
        b.innerHTML = blocks.value;
        pixelate();
        drawMosaic();
    }, false);
};

let avgColors = [
{"r":96,"g":124,"b":181,"a":255},
{"r":237,"g":157,"b":84,"a":251},
{"r":123,"g":170,"b":250,"a":255},
{"r":40,"g":42,"b":41,"a":47},
{"r":90,"g":0,"b":0,"a":90},
{"r":246,"g":168,"b":154,"a":255},
{"r":110,"g":110,"b":110,"a":160},
{"r":30,"g":128,"b":124,"a":115},
{"r":81,"g":72,"b":71,"a":254},
{"r":65,"g":65,"b":65,"a":239},
{"r":241,"g":221,"b":221,"a":255},
{"r":251,"g":126,"b":97,"a":239},
{"r":31,"g":119,"b":251,"a":245},
{"r":237,"g":145,"b":148,"a":221},
{"r":242,"g":162,"b":42,"a":249},
{"r":196,"g":99,"b":28,"a":175},
{"r":194,"g":188,"b":180,"a":247},
{"r":74,"g":163,"b":251,"a":246},
{"r":39,"g":11,"b":15,"a":34},
{"r":63,"g":63,"b":63,"a":83},
{"r":27,"g":36,"b":114,"a":92},
{"r":179,"g":211,"b":255,"a":255},
{"r":129,"g":184,"b":137,"a":255},
{"r":196,"g":216,"b":228,"a":255},
{"r":17,"g":17,"b":17,"a":64},
{"r":17,"g":17,"b":17,"a":64},
{"r":56,"g":119,"b":255,"a":255},
{"r":102,"g":100,"b":96,"a":255},
{"r":13,"g":13,"b":13,"a":125},
{"r":64,"g":158,"b":158,"a":255},
{"r":121,"g":48,"b":17,"a":93},
{"r":227,"g":232,"b":237,"a":252},
{"r":248,"g":183,"b":120,"a":253},
{"r":35,"g":35,"b":35,"a":255},
{"r":248,"g":183,"b":120,"a":253},
{"r":33,"g":0,"b":192,"a":170},
{"r":35,"g":69,"b":120,"a":143},
{"r":39,"g":80,"b":145,"a":251},
{"r":93,"g":141,"b":161,"a":255},
{"r":133,"g":112,"b":120,"a":101},
{"r":252,"g":223,"b":221,"a":250},
{"r":30,"g":64,"b":70,"a":71},
{"r":145,"g":197,"b":231,"a":255},
{"r":10,"g":10,"b":10,"a":124},
{"r":135,"g":177,"b":213,"a":255},
{"r":239,"g":74,"b":65,"a":254},
{"r":68,"g":71,"b":87,"a":255},
{"r":178,"g":177,"b":224,"a":250},
{"r":165,"g":20,"b":32,"a":115},
{"r":95,"g":66,"b":39,"a":74},
{"r":93,"g":86,"b":78,"a":113},
{"r":180,"g":51,"b":54,"a":200},
{"r":204,"g":44,"b":44,"a":255},
{"r":27,"g":27,"b":26,"a":109},
{"r":110,"g":182,"b":220,"a":253},
{"r":180,"g":129,"b":129,"a":189},
{"r":106,"g":45,"b":23,"a":70},
{"r":121,"g":148,"b":93,"a":163},
{"r":116,"g":116,"b":116,"a":203},
{"r":69,"g":119,"b":200,"a":255},
{"r":58,"g":207,"b":249,"a":255},
{"r":37,"g":68,"b":49,"a":220},
{"r":44,"g":44,"b":44,"a":224},
{"r":7,"g":26,"b":49,"a":61},
{"r":145,"g":100,"b":61,"a":255},
{"r":104,"g":187,"b":255,"a":255},
{"r":210,"g":162,"b":69,"a":255},
{"r":189,"g":77,"b":82,"a":255},
{"r":82,"g":140,"b":25,"a":156},
{"r":0,"g":50,"b":131,"a":105},
{"r":179,"g":45,"b":97,"a":202},
{"r":195,"g":122,"b":89,"a":199},
{"r":66,"g":55,"b":31,"a":202},
{"r":227,"g":18,"b":11,"a":255},
{"r":81,"g":128,"b":168,"a":255},
{"r":95,"g":85,"b":78,"a":156},
{"r":243,"g":180,"b":196,"a":114},
{"r":51,"g":63,"b":52,"a":103},
{"r":36,"g":36,"b":36,"a":255},
{"r":35,"g":69,"b":105,"a":125},
{"r":228,"g":223,"b":222,"a":255},
{"r":246,"g":127,"b":52,"a":255},
{"r":42,"g":42,"b":160,"a":191},
{"r":245,"g":110,"b":70,"a":201},
{"r":79,"g":96,"b":137,"a":194},
{"r":122,"g":64,"b":66,"a":137},
{"r":104,"g":134,"b":173,"a":255},
{"r":181,"g":180,"b":174,"a":200},
{"r":192,"g":179,"b":200,"a":202},
{"r":8,"g":8,"b":8,"a":73},
{"r":32,"g":31,"b":21,"a":96},
{"r":99,"g":47,"b":61,"a":87},
{"r":74,"g":72,"b":111,"a":255},
{"r":70,"g":54,"b":55,"a":226},
{"r":227,"g":188,"b":161,"a":255},
{"r":50,"g":0,"b":152,"a":208},
{"r":72,"g":0,"b":14,"a":47},
{"r":192,"g":53,"b":70,"a":178},
{"r":15,"g":14,"b":14,"a":111},
{"r":115,"g":115,"b":115,"a":255},
{"r":23,"g":23,"b":23,"a":59},
{"r":10,"g":8,"b":8,"a":66},
{"r":93,"g":89,"b":77,"a":109},
{"r":220,"g":211,"b":187,"a":255},
{"r":181,"g":180,"b":174,"a":200},
{"r":65,"g":65,"b":65,"a":252},
{"r":21,"g":103,"b":139,"a":143},
{"r":58,"g":58,"b":58,"a":200},
{"r":140,"g":92,"b":99,"a":169},
{"r":128,"g":146,"b":190,"a":207},
{"r":220,"g":182,"b":175,"a":120},
{"r":159,"g":136,"b":140,"a":222},
{"r":46,"g":71,"b":69,"a":108},
{"r":213,"g":207,"b":220,"a":255},
{"r":187,"g":169,"b":164,"a":255},
{"r":43,"g":76,"b":76,"a":255},
{"r":29,"g":180,"b":244,"a":135},
{"r":12,"g":185,"b":147,"a":230},
{"r":0,"g":0,"b":0,"a":45},
{"r":170,"g":145,"b":26,"a":255},
{"r":204,"g":57,"b":71,"a":203},
{"r":62,"g":159,"b":131,"a":243},
{"r":209,"g":116,"b":149,"a":247},
{"r":151,"g":173,"b":201,"a":255},
{"r":216,"g":110,"b":79,"a":216},
{"r":111,"g":183,"b":74,"a":251},
{"r":68,"g":147,"b":104,"a":204},
{"r":142,"g":119,"b":74,"a":157},
{"r":60,"g":111,"b":119,"a":255},
{"r":64,"g":64,"b":64,"a":255},
{"r":106,"g":48,"b":50,"a":94},
{"r":75,"g":155,"b":201,"a":254},
{"r":183,"g":178,"b":172,"a":220},
{"r":79,"g":203,"b":79,"a":247},
{"r":51,"g":113,"b":162,"a":173},
{"r":81,"g":21,"b":22,"a":71},
{"r":22,"g":104,"b":138,"a":178},
{"r":0,"g":43,"b":79,"a":133},
{"r":166,"g":51,"b":51,"a":255},
{"r":237,"g":145,"b":148,"a":221},
{"r":86,"g":149,"b":170,"a":251},
{"r":93,"g":91,"b":91,"a":156},
{"r":218,"g":162,"b":173,"a":246},
{"r":24,"g":181,"b":241,"a":255},
{"r":64,"g":62,"b":61,"a":255},
{"r":249,"g":191,"b":200,"a":255},
{"r":156,"g":153,"b":68,"a":237},
{"r":112,"g":43,"b":163,"a":169},
{"r":207,"g":161,"b":161,"a":255},
{"r":62,"g":62,"b":62,"a":255},
{"r":113,"g":116,"b":118,"a":255},
{"r":72,"g":14,"b":16,"a":49},
{"r":106,"g":134,"b":65,"a":166},
{"r":0,"g":0,"b":0,"a":99},
{"r":128,"g":159,"b":89,"a":250},
{"r":195,"g":215,"b":127,"a":151},
{"r":42,"g":53,"b":100,"a":138},
{"r":119,"g":95,"b":0,"a":90},
{"r":81,"g":213,"b":64,"a":253},
{"r":93,"g":86,"b":78,"a":113},
{"r":246,"g":155,"b":99,"a":255},
{"r":115,"g":153,"b":58,"a":237},
{"r":53,"g":85,"b":174,"a":65},
{"r":134,"g":134,"b":134,"a":129},
{"r":172,"g":84,"b":37,"a":146},
{"r":59,"g":97,"b":94,"a":146},
{"r":77,"g":91,"b":109,"a":167},
{"r":159,"g":198,"b":109,"a":255},
{"r":48,"g":111,"b":167,"a":201},
{"r":43,"g":37,"b":40,"a":74},
{"r":97,"g":80,"b":56,"a":131},
{"r":193,"g":96,"b":96,"a":134},
{"r":32,"g":32,"b":32,"a":76},
{"r":39,"g":42,"b":31,"a":91},
{"r":120,"g":22,"b":23,"a":106},
{"r":39,"g":67,"b":99,"a":255},
{"r":136,"g":92,"b":22,"a":61},
{"r":20,"g":37,"b":54,"a":70},
{"r":23,"g":63,"b":104,"a":99},
{"r":39,"g":37,"b":37,"a":118},
{"r":83,"g":12,"b":18,"a":87},
{"r":169,"g":192,"b":219,"a":255},
{"r":41,"g":130,"b":167,"a":252},
{"r":187,"g":174,"b":166,"a":255},
{"r":64,"g":64,"b":64,"a":85},
{"r":133,"g":133,"b":168,"a":255},
{"r":108,"g":131,"b":145,"a":155},
{"r":173,"g":57,"b":66,"a":200},
{"r":239,"g":239,"b":239,"a":255},
{"r":255,"g":227,"b":215,"a":255},
{"r":157,"g":162,"b":132,"a":204},
{"r":165,"g":68,"b":53,"a":195},
{"r":61,"g":103,"b":251,"a":255},
{"r":231,"g":97,"b":50,"a":201},
{"r":139,"g":69,"b":0,"a":54},
{"r":60,"g":50,"b":54,"a":241},
{"r":150,"g":78,"b":15,"a":73},
{"r":68,"g":135,"b":142,"a":202},
{"r":244,"g":138,"b":138,"a":106},
{"r":106,"g":134,"b":65,"a":166},
{"r":124,"g":64,"b":63,"a":128},
{"r":227,"g":224,"b":226,"a":255},
{"r":50,"g":116,"b":154,"a":194},
{"r":255,"g":103,"b":42,"a":255},
{"r":116,"g":58,"b":14,"a":87},
{"r":219,"g":173,"b":175,"a":255},
{"r":19,"g":15,"b":15,"a":167},
{"r":205,"g":206,"b":207,"a":255},
{"r":34,"g":34,"b":34,"a":78},
{"r":76,"g":41,"b":13,"a":51},
{"r":113,"g":56,"b":57,"a":142},
{"r":15,"g":52,"b":101,"a":149},
{"r":134,"g":126,"b":121,"a":200},
{"r":3,"g":84,"b":134,"a":123},
{"r":206,"g":91,"b":63,"a":196},
{"r":35,"g":171,"b":112,"a":194},
{"r":220,"g":140,"b":109,"a":222},
{"r":56,"g":165,"b":43,"a":254},
{"r":211,"g":67,"b":63,"a":191},
{"r":79,"g":11,"b":7,"a":86},
{"r":114,"g":154,"b":159,"a":255},
{"r":58,"g":60,"b":58,"a":255},
{"r":58,"g":58,"b":58,"a":200},
{"r":77,"g":57,"b":34,"a":255},
{"r":239,"g":60,"b":65,"a":255},
{"r":0,"g":30,"b":47,"a":38},
{"r":41,"g":40,"b":35,"a":110},
{"r":177,"g":211,"b":208,"a":255},
{"r":176,"g":120,"b":45,"a":255},
{"r":72,"g":85,"b":104,"a":199},
{"r":52,"g":127,"b":156,"a":121},
{"r":44,"g":48,"b":15,"a":218},
{"r":81,"g":96,"b":68,"a":255},
{"r":0,"g":45,"b":80,"a":159},
{"r":87,"g":202,"b":158,"a":198},
{"r":193,"g":192,"b":193,"a":255},
{"r":171,"g":125,"b":86,"a":196},
{"r":0,"g":99,"b":163,"a":154},
{"r":0,"g":53,"b":60,"a":111},
{"r":149,"g":130,"b":161,"a":251},
{"r":26,"g":26,"b":26,"a":255},
{"r":46,"g":187,"b":242,"a":251},
{"r":124,"g":13,"b":35,"a":106},
{"r":104,"g":144,"b":191,"a":246},
{"r":199,"g":214,"b":231,"a":253},
{"r":0,"g":0,"b":0,"a":75},
{"r":10,"g":46,"b":68,"a":99},
{"r":70,"g":177,"b":221,"a":255},
{"r":18,"g":68,"b":112,"a":87},
{"r":130,"g":58,"b":43,"a":125},
{"r":7,"g":100,"b":147,"a":169},
{"r":82,"g":91,"b":102,"a":255},
{"r":180,"g":209,"b":226,"a":255},
{"r":0,"g":68,"b":75,"a":255},
{"r":93,"g":93,"b":93,"a":123},
{"r":214,"g":214,"b":214,"a":247},
{"r":45,"g":45,"b":45,"a":255},
{"r":42,"g":42,"b":42,"a":255},
{"r":90,"g":178,"b":214,"a":255},
{"r":83,"g":183,"b":212,"a":199},
{"r":146,"g":146,"b":145,"a":205},
{"r":219,"g":219,"b":219,"a":255},
{"r":135,"g":66,"b":55,"a":153},
{"r":219,"g":230,"b":199,"a":251},
{"r":72,"g":0,"b":14,"a":47},
{"r":86,"g":29,"b":159,"a":234},
{"r":33,"g":79,"b":126,"a":255},
{"r":85,"g":12,"b":0,"a":68},
{"r":67,"g":5,"b":0,"a":53},
{"r":159,"g":9,"b":9,"a":143},
{"r":185,"g":129,"b":119,"a":255} ];
