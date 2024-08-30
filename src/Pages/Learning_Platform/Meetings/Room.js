import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import './Room.css'
const Room = () =>{
    const { roomID } = useParams();
    const myMeeting = async(element) =>{
        const appID = 1920129428;
        const serverSecret = "76cc4662d2057482c1758703af9f0887";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret,roomID,Date.now().toString(),"Trushu")
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container:element,
            scenario:{
                mode:ZegoUIKitPrebuilt.VideoConference,
            },
        });
    }
    return(
        <div >
            <div ref={myMeeting} className="room-page"/>
        </div>
    )
}
export default Room