import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import './Room.css';

const Room = () => {
    const { roomID } = useParams();
    const roomContainerRef = useRef(null);

    useEffect(() => {
        if (roomContainerRef.current) {
            const appID = 1920129428;
            const serverSecret = "76cc4662d2057482c1758703af9f0887";
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "Your Identification");
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zp.joinRoom({
                container: roomContainerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.VideoConference,
                },
            });
        }
    }, [roomID]);

    return (
        <div>
            <div ref={roomContainerRef} className="room-page"/>
        </div>
    );
}

export default Room;
