import React, { Component } from "react";
//import { Grid } from 'semantic-ui-react';
import { isAuthenticated } from "../auth";

import {getMessages,sendMessage} from './apiUser'

import { Chat,addResponseMessage,addUserMessage } from 'react-chat-popup';

import DefaultProfile from "../images/default_profile_image.png";


import io from "socket.io-client";

  const socket = io.connect("http://localhost:3001",{ transports: ['websocket', 'polling', 'flashsocket']});

class ChatPage extends Component {

      constructor(){
        super();
        this.state={
          to:'',
          //from: isAuthenticated().user._id,
          from: isAuthenticated().user ? isAuthenticated().user._id : "",
          messages:[],
          nickname: ""
        }
      }

    
      
       handleNewUserMessage = (newMessage) => {

        
          console.log(`New message incoming! ${newMessage}`);
          let to_user=this.props.user._id
          let from_user=isAuthenticated().user._id
          let token=isAuthenticated().token
          let text=newMessage
          //emit the message to the receiver's socket
          console.log('New message details to from and the text',to_user,from_user,text)
          socket.emit("chat_message", {
              receiver:to_user,
              sender:from_user,
              message:newMessage
            });
          //add the message in database
          sendMessage(to_user,from_user,text,token).then(data=>{
          	if(data.error){
          		console.log(data.error)
          	}
          	else
          		console.log('Data recieved after sending the messages',data)
              let new_message=data.new_message
              console.log('Object to be appended to the existing message',new_message)
               this.setState({
                messages:[...this.state.messages,new_message]
                 })
              
          }) 

    // Now send the message throught the backend API
      }
 
      AllMessages=()=>{
        //Fetch the old messages shared between the users
      let user1=this.props.user._id
      this.setState({to:user1})
      let user2=isAuthenticated().user._id
      let token=isAuthenticated().token
      getMessages(user1,user2,token).then(data=>{
        if(data.error){
          console.log(data.error)
        }
        else
        {
          console.log(data)
          this.setState({messages:data,displayMessage:true,currentRecipient:user1})
          this.renderMessage()
         
        }
      })

    }
    componentDidMount(){
      //listening to the new messages emitted to the current user's socket
       socket.on("new_message", (data) => {
            // Add new messages to existing messages in "chat"
            console.log('Received message inside componentDidMount lifecycle',data);
           addResponseMessage(data.message)
            this.setState({
                messages:[...this.state.messages,{

                body:data.message,
                from:data.sender,
                to:data.receiver,
                date:Date.now
                }]

            })
            console.log(this.state.messages)
            //addResponseMessage(data.message)
            
          })

    }
    componentWillReceiveProps(props) {
        const userId =this.props.user._id;
        this.setState({to:userId})

        socket.emit('User_Connected',isAuthenticated().user._id)
      
        this.AllMessages()
        

     }
     componentWillUnmount(){
      if(this.state.messages.length>0){

        window.location.reload();
      }
           
     }
   
     renderMessage=()=>{
       <div>
        {this.state.messages.length>0?(
          <div>
            {this.state.messages.map((message,i)=>

              <div key={i}>
                {message.from===isAuthenticated().user._id?
                  (addUserMessage(message.body)):(addResponseMessage(message.body))
                }
              </div>

              )}
          </div>

          ):(<div>addResponseMessage("Start new conversation")</div>)}
        </div>
      
     }

    render() {

      const userId=this.props.user._id
      const photoUrl = userId
      ? (`${process.env.REACT_APP_API_URL}/user/photo/${
          userId
        }?${new Date().getTime()}`)
      : DefaultProfile

      
       return(
      
       <div>
         <Chat
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={photoUrl}
          title={this.props.user.name}
          subtitle="And my cool subtitle"
        />

       </div>
       

        )
      
     }
}

export default ChatPage