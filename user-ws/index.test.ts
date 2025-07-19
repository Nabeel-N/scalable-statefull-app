import { test, describe, expect } from "bun:test";

const BACKEND_URL = "ws://localhost:8080";

describe("Chat application", () => {
  test("Message sent from room 1 reaches another participant in room 1", async () => {
    const ws1 = new WebSocket(BACKEND_URL);
    const ws2 = new WebSocket(BACKEND_URL);

    await new Promise<void>((resolve, reject) => {
      let count = 0;
      ws1.onopen = () => {
        count = count + 1;
        if (count == 2) {
          resolve();
        }
      };

      ws2.onopen = () => {
        count = count + 1;
        if (count == 2) {
          resolve();
        }
      };
    });

    ws1.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );

    ws2.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );
    console.log("after sending the data join room ");

    await new Promise<void>((resolve, reject) => {
      ws2.onmessage = ({ data }) => {
        console.log(data);
        const parsedData = JSON.parse(data);
        expect(parsedData.type === "chat");
        expect(parsedData.message === "Hi there");
        resolve();
        console.log("resolved onmessage");
      };

      ws1.send(
        JSON.stringify({
          type: "chat",
          room: "Room 1",
          message: "Hi there",
        })
      );
    });

  });
  console.log("control reached the last");
});
