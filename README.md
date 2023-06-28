# modelToImage
it will convert 3d model to image using threejs

## Usage
To start taking screenshots of GLB files

 modelToImage() function will convert glb model to image and download the image.

```sh
npm i three
```
```sh
async function convertmodelToImage(){

  // inFilePathUrl  - this will path of file or its dynamic for input tag then you can generate the filepath from file using blob

  let imageLink = await modelToImage(inFilePathUrl)
  console.log(imageLink)
}
convertmodelToImage()
```
modelToImage() function will create threejs scene and load the model into scene and convert the threejs scene canvas to image and download the image, after all  you can modify the function as you want in this function.

If you find any updates, commit the update


