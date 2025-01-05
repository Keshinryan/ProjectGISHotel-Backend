const fs=require('fs');
DeleteFile=(filePath)=>{
    fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File deleted successfully');
  })
};

module.exports={DeleteFile};