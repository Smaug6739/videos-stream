# Streaming server  
  
This project is an exemple of streaming server for send partial content of videos.  
  
## Install  
  
1. Clone the repo  
2. Install packages `npm install`  
3. Start server `npm run start`  

## Usage  
  
The files are in dirrectory `/assets/videos/{file}`.  
  
### End points  

* GET `/videos/:video_name`  
Return a partial video content (206) for stream.  

### Base URL

API url : `http://domain.com/api/v1`  
