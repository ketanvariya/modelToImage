# modelToImage
it will convert 3d model to image using threejs

how to use this function :

async function convertmodelToImage(){

  // this modelToImage() function will convert glb model to image and download it you can modify the function as you want
  let inFilePathUrl // this will path of file or its dynamic for input tag then you can generate the filepath from file using blob
  
  let imageLink = await modelToImage(inFilePathUrl)
  console.log(imageLink)
}


