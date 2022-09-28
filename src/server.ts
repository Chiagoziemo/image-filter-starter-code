//import express from 'express';
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage/", 
    async (req: Request, res: Response ) => {
      let image_url = req.query.image_url.toString();
      //IT SHOULD
      //    1
      //    1. validate the image_url query     
      if(!image_url) {
        return res.status(400).send('An image URL is required');
      }
      //    2. call filterImageFromURL(image_url) to filter the image
      const filterImage = await filterImageFromURL(image_url);
      //    3. send the resulting file in the response
      res.status(200).sendFile(filterImage, () => {
        deleteLocalFiles([filterImage]);
      });
      //deleteLocalFiles([filterImage]);

    }
  );
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();