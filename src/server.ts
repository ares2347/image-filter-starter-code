import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {config} from 'dotenv'
(async () => {

  // Init the Express application
  const app = express();
  config();
  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
app.get("/filteredimage", async (req: Request, res: Response) => {
  const image_url : string = req.query.image_url;
  if (!image_url) { 
    // respond with an error if not
    res.status(400).send("image_url is required");
  }
  try {
    const local_file_path : string = await filterImageFromURL(image_url);
    res.status(200).sendFile(local_file_path);
    res.on("finish", async () => await deleteLocalFiles([local_file_path]));
  } catch (error) {
    res.send(error);
    res.status(404).send("image_url is invalid. File not found.")
  }
});
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req : Request, res : Response) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();