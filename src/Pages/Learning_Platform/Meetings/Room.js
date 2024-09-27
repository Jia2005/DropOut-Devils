import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import './Room.css';

const Room = () => {
    const { roomID } = useParams();
    const roomContainerRef = useRef(null);

    useEffect(() => {
        if (roomContainerRef.current) {
            const appID = 737088863;
            const serverSecret = "85c97d88f3ceb5ad24f38dc3479317da";
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
