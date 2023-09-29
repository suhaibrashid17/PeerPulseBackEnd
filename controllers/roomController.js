//room controller

const Room = require("../models/Room");
const createRoom = async (req, res) => {
  const RoomName = req.body.Room;
  const user = req.body.currentUser;
  if (!RoomName) {
    res.status(404).json({ error: "You Crazy Son of a Gun! Enter a Name!" });
  }
  try {
    const TRoom = await Room.create({
      name: RoomName,
      createdBy: user,
      members: [user],
      startingTime:Date.now(),
      isPublic:req.body.isPublic
    });
    res.status(200).json({Success:"Room Created Successfully!"});
  } catch (err) {
    console.log(err);
  }
};

const SearchRoom = async (req, res) => {
  const Rooms = req.query.RoomName;
  if(Rooms)
  {
  try {
    const searchResult = await Room.find( { name:{$regex:'.*'+Rooms+'.*'},isPublic:true} );  // this is LIKE command in SQL
    if (searchResult) {
      res.status(200).json(searchResult);
    } else {
      res.json({ NoResults: "No results found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
else
{
    console.log('all');
    try{
    const searchResult = await Room.find({isPublic:true});
    console.log(searchResult);
    if (searchResult) {
        res.status(200).json(searchResult);
      } else {
        res.json({ NoResults: "No results found" });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
}
};

const DeleteExpiredRooms=async()=>{
  const currentTime = Date.now();
console.log('Current time:', new Date(currentTime).toISOString());  // toISOString() Function converts Date into String

const oneHourAgo = new Date(currentTime - 1000 * 60 * 60);
console.log('One hour ago:', oneHourAgo.toISOString());

  console.log(currentTime);
   try{
    const response=await Room.deleteMany({startingTime:{$lt:oneHourAgo}});
    console.log('deleted Successfully');
   }
   catch(error){
    console.log(error);
   }
}
const SearchRoomByID=async(req,res)=>{
  const roomID=String(req.query.RoomID.id);
  roomID.String
   try{
    const response=await Room.findOne({_id:roomID}); 
    if(response)
    {
      res.status(200).json(response);
    }
    else{
      res.status(404).json({error:"No Room found."});
    }
   }
   catch(err)
   {
      res.status(404).json({error:"Error Finding Room"}); 
   }
}

module.exports = { createRoom,SearchRoom,DeleteExpiredRooms,SearchRoomByID };
