import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
// import "./MeetingScheduler.css";

const MeetingScheduler = () => {
  // State variables
  const [meetings, setMeetings] = useState([]); // List of all meetings
  const [numRooms, setNumRooms] = useState(1); // Number of available rooms
  const [scheduledMeetings, setScheduledMeetings] = useState([]); // Scheduled meetings in rooms

  const [newMeeting, setNewMeeting] = useState({
    meeting: "",
    startTime: "",
    endTime: "",
  }); // Input fields for adding a new meeting

  // Event handler for changing the number of available rooms
  const handleNumRoomsChange = (event) => {
    setNumRooms(parseInt(event.target.value));
  };

  // Event handler for input field changes
  const handleInputChange = (event) => {
    setNewMeeting({
      ...newMeeting,
      [event.target.name]: event.target.value,
    });
  };

  // Event handler for adding a new meeting
  const handleAddMeeting = () => {
    if (
      // Validation checks for input fields
      newMeeting.meeting.trim() === "" ||
      newMeeting.startTime.trim() === "" ||
      newMeeting.endTime.trim() === ""
    ) {
      toast.error("Please enter all meeting details.");
      return;
    }
    //create two Date objects
    const startTime = new Date(`2000/01/01 ${newMeeting.startTime}`);
    const endTime = new Date(`2000/01/01 ${newMeeting.endTime}`);

    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
      toast.error(
        "Invalid meeting time. Please enter a valid start and end time."
      );
      return;
    }

    if (scheduledMeetings.length >= numRooms) {
      toast.error("All rooms are already scheduled. Cannot add more meetings.");
      return;
    }

    // Check for conflicts with existing meetings
    const hasConflict = meetings.some((existingMeeting) => {
      const existingStartTime = new Date(
        `2000/01/01 ${existingMeeting.startTime}`
      );
      const existingEndTime = new Date(`2000/01/01 ${existingMeeting.endTime}`);

      return (
        (startTime >= existingStartTime && startTime < existingEndTime) ||
        (endTime > existingStartTime && endTime <= existingEndTime) ||
        (startTime <= existingStartTime && endTime >= existingEndTime)
      );
    });

    if (hasConflict) {
      toast.error(
        "Meeting time conflicts with an existing meeting. Please choose a different time."
      );
      return;
    }

    // Add the new meeting to the list of meetings if all checks pass
    setMeetings([...meetings, newMeeting]);
    setNewMeeting({
      meeting: "",
      startTime: "",
      endTime: "",
    });

    toast.success("Meeting added successfully!");
  };

  // Event handler for scheduling the meetings into rooms
  const handleScheduleMeetings = () => {
    const sortedMeetings = [...meetings].sort((a, b) => {
      const timeA = new Date(`2000/01/01 ${a.startTime}`);
      const timeB = new Date(`2000/01/01 ${b.startTime}`);
      return timeA - timeB;
    });

    // Initialize an array of rooms with empty arrays with length equal to numrooms
    const rooms = Array.from({ length: numRooms }, () => []);

    sortedMeetings.forEach((meeting) => {
      let scheduled = false;

      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];

        if (!room.length) {
          // If the room is empty, add the meeting directly
          room.push(meeting);
          scheduled = true;
          break;
        }

        const hasConflict = room.some((scheduledMeeting) => {
          const scheduledStartTime = new Date(
            `2000/01/01 ${scheduledMeeting.startTime}`
          );
          const scheduledEndTime = new Date(
            `2000/01/01 ${scheduledMeeting.endTime}`
          );
          const newStartTime = new Date(`2000/01/01 ${meeting.startTime}`);
          const newEndTime = new Date(`2000/01/01 ${meeting.endTime}`);

          return (
            (scheduledStartTime <= newStartTime &&
              newStartTime < scheduledEndTime) ||
            (newStartTime <= scheduledStartTime &&
              scheduledStartTime < newEndTime)
          );
        });

        if (!hasConflict) {
          // If no conflict, add the meeting to the room
          room.push(meeting);
          scheduled = true;
          break;
        }
      }

      if (!scheduled) {
        // Create a new room if no existing room is available
        rooms.push([meeting]);
      }
    });

    // Set the scheduled meetings in rooms
    setScheduledMeetings(rooms);
  };

  // Parse and set the initial meetings from the JSON data
  useState(() => {
    const jsonMeetings = [
      {
        meeting: "Introduction to Nonsense Theory",
        time: "8:30 AM - 9:00 AM",
      },
      {
        meeting: "Advanced Chair Spinning Techniques",
        time: "10:15 AM - 11:00 AM",
      },
      {
        meeting: "Unicorn Wrangling Workshop",
        time: "12:45 PM - 1:30 PM",
      },
      {
        meeting: " Wrangling Workshop",
        time: "12:48 PM - 1:30 PM",
      },
      {
        meeting: "The Art of Bubble Wrap Popping",
        time: "2:45 PM - 3:30 PM",
      },
      {
        meeting: "Dance-Off with Office Plants",
        time: "4:15 PM - 5:00 PM",
      },
    ];

    const parsedMeetings = jsonMeetings.map((jsonMeeting) => {
      const [startTime, endTime] = jsonMeeting.time.split(" - ");
      const formattedStartTime = new Date(
        `2000/01/01 ${startTime}`
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedEndTime = new Date(
        `2000/01/01 ${endTime}`
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      return {
        meeting: jsonMeeting.meeting,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
    });

    setMeetings(parsedMeetings);
  });

  // console.log(scheduledMeetings);

  return (
    <div className="flex justify-center items-center h-scree mt-5">
      <div className="meeting-scheduler">
        <h2 className="text-2xl font-bold mb-4">Meeting Scheduler</h2>
        <div className="meeting-form">
          <div className="form-field mb-4">
            <label className="block font-bold">
              Number of Available Rooms:
            </label>
            <input
              className="p-2 border border-gray-300 rounded"
              type="number"
              value={numRooms}
              onChange={handleNumRoomsChange}
              min="1"
            />
          </div>
          {meetings.map((meeting, index) => (
            <div className="form-field mb-4" key={index}>
              <label className="block font-bold">{meeting.meeting}:</label>
              <span className="mr-2">{meeting.startTime} -</span>
              <span>{meeting.endTime}</span>
            </div>
          ))}
          <div className="form-field mb-4">
            <label className="block font-bold">Add Meeting:</label>
            <div className="flex items-center">
              <input
                className="p-2 border border-gray-300 rounded mr-2"
                type="text"
                name="meeting"
                value={newMeeting.meeting}
                onChange={handleInputChange}
                placeholder="Meeting name"
              />
              <input
                className="p-2 border border-gray-300 rounded mr-2"
                type="text"
                name="startTime"
                value={newMeeting.startTime}
                onChange={handleInputChange}
                placeholder="Start time (e.g., 9:00 AM)"
              />
              <input
                className="p-2 border border-gray-300 rounded"
                type="text"
                name="endTime"
                value={newMeeting.endTime}
                onChange={handleInputChange}
                placeholder="End time (e.g., 10:00 AM)"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={handleAddMeeting}
            >
              Add Meeting
            </button>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleScheduleMeetings}
          >
            Schedule Meetings
          </button>
        </div>
        <div className="scheduled-meetings mt-8 grid grid-cols-2 gap-4">
          {scheduledMeetings.map((room, index) => (
            <div className="room mb-8" key={index}>
              <h3 className="text-lg font-bold mb-2">Room {index + 1}</h3>
              <ul>
                {room.map((meeting, index) => (
                  <li key={index} className="mb-2">
                    {meeting.meeting} - {meeting.startTime} - {meeting.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default MeetingScheduler;
