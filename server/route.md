POST http://localhost:8000/register/?username={username}&password={password}
POST http://localhost:8000/login/?username={username}&password={password}
POST http://localhost:8000/logout/

GET http://localhost:8000/message/chatrooms/
- return a list of chatroom ids that the user is part of in json
- *use session user id to determin rooms

GET http://localhost:8000/message/getUser/?name={name}
- search for users with name
- return json of list of users with {name}
- can return 500 if something failed or an empty json object if there is no user with username of name

GET http://localhost:8000/message/longpoll/?chatroomid={chatroomid}
- add polling connection to pool
- needs to check if the user is in the chatroom, if user is not in the chatroom return error status code 500 and message

GET http://localhost:8000/message/endpoll/?chatroomid={chatroomid}
- since longpoll connection only gets disconnected at when a participants sends a message, there may be cases where the client wants to end the poll connection to a chatroom without sending a message such as switching chatroom
- ends connection and return 500 if something went wrong otherwise an ok message is returned
- on ending connection sends a list of most recent messages back through the response

POST http://localhost:8000/message/sendMessage/?chatroomid={chatroomid}&message={message}
- return status code on whether a message is posted successfully
- if message is successfully sent the pool of open longpoll connections to the chatroom are ended, sendmessage requests are not kept open like longpoll connections and immediately return upon successful message save to database
- 500 for unsuccessful, a list of most recent messages if posted successfully

POST http://localhost:8000/message/newChatroom/
- just starts a new chatroom return created chatroom id
- use user as the administrator for chatroom
- only this user has ability to add new participants

POST http://localhost:8000/message/addToChatroom/?chatroomid={chatroomid}&usertoadd={userid}
- use session user id to to check if user is admin
- if so add user to chatroom
- return chatroom object with list of participants

GET http://localhost:8000/message/chatroomParticipants/?chatroomid={chatroomid}
- return a list of chatroom participants in {chatroomid}
- check if user asking the info is in the chatroom