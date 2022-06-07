import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {singlePost, update} from "./apiPost";
import {Redirect} from "react-router-dom";
import defaultPostImage from "../images/default-post-image.jpeg";

class EditPost extends Component {
    constructor() {
        super();
        this.state={
            id: "",
            title: "",
            body: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
        }
    }

    init = postId => {
        //passing the postId passed from componentDidMount method
        singlePost(postId).then(data => {
            if(data.error) //if we get any error in the response from back end
                this.setState({redirectToProfile: true});
            else
                this.setState({id: data._id, title: data.title,
                    body: data.body, error: ""});
        });
    }

    componentDidMount()
    {
        this.postData= new FormData();
        const postId= this.props.match.params.postId;
        this.init(postId);

    } //end of componentDidMount method

    isValid = () => {
        const {title, body, fileSize} = this.state;
        if(fileSize > 1000000)  // if size > 1 mb
        {
            this.setState({error: "file size should be less than 1 mb", loading: false});
            return false;
        }
        else if(title.length === 0 || body.length===0)//set loading=false(deactivate loading page) while showing error prompt
        {
            this.setState({error: "all fields are required", loading: false});
            return false;
        }
        return true; // if no error, we return true

    }; // end of isValid method

    //curried function -- on calling function with one parameter name it will return another function
    // which requires event as input and sets the state
    handleChange = name => event => {
        this.setState({error: ""}); //making error print inactive on front end
        let value = (name === "photo" ? event.target.files[0] : event.target.value);
        const photoSize= name === "photo"? event.target.files[0].size: 0 ;
        this.postData.set(name, value); //appending field by field to postData ... field name and field value
        this.setState({[name]: value, fileSize: photoSize});
    }; // handle change method end

    //onClickSubmit will get an event upon clicking
    onClickSubmit = event => {
        //preventing default behaviour of the browser. i.e reloading on click
        event.preventDefault();
        this.setState({loading: true});
        if(this.isValid())
        {
            //console.log(user);
            const postId= this.state.id;
            const token= isAuthenticated().token;

            update(postId, token, this.postData).then(data => {
                if(data.error)
                    this.setState({error: data.error});
                else
                {
                    console.log("New post: ", data);
                    this.setState({      //resetting all the fields
                        loading: false,
                        title: "",
                        body: "",
                        photo: "",
                        redirectToProfile: true
                    })
                }
            });
        } //end of if(isValid()) condition
        else
            this.setState({loading: false}) //inactivating loading page div element
    }; // end of onClickSubmit method


    //code refactoring -- moving form from render method to here
    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">post picture</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}></textarea>
            </div>
            <button onClick={this.onClickSubmit} className="btn btn-raised btn-primary">update post</button>

        </form>
    ); //end of editPostForm

    render() {
        const{id,title, body, error, loading, redirectToProfile}= this.state;
        if(redirectToProfile)
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>

                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>: ""
                }

                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
                     style={{height: "200px", width: "auto"}}
                     onError={i => (i.target.src= `${defaultPostImage}`)}
                     className="img-thumbnail" alt={title}/>
                {this.editPostForm(title, body)}
            </div>
        );
    }
}

export default EditPost;