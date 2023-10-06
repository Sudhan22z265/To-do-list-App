import React, { useEffect, useState } from "react";
import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";
import {format} from 'date-fns'
import {  Route, Routes, useNavigate } from "react-router-dom";
import api from './api/Posts'
import EditPost from "./EditPost";

function App() {
  const [posts,setPosts] = useState([])
  const navi= useNavigate()
  const [search,setSearch]=useState('')
  const [searchResults,setSearchResults]=useState([])
  const [postTitle,setPostTitle]=useState('')
  const [postBody,setPostBody]=useState('')
  const [editTitle,setEditTitle]=useState('')
  const [editBody,setEditBody]=useState('')
  useEffect( ()=>{
    const fetchposts = async () =>{
      try{
        const response = await api.get('/posts');
        setPosts(response.data)
      } catch(err){
        if(err.response)
        {
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        }
        else{
          console.log(`Error : ${err.message}`)
        }
      }
    }
    fetchposts()
  }
  

 ,[] )
  useEffect(()=>{
    const filResults = posts.filter((post)=>
    ((post.body).toLowerCase()).includes(search.toLowerCase()) ||
    ((post.title).toLowerCase()).includes(search.toLowerCase())
    )
    setSearchResults(filResults.reverse())
  },[posts,search]

  )
  const handleSubmit = async (e) =>{
    e.preventDefault()
    const date=format(new Date(),  'MMMM dd, yyypp')
    const newid = posts.length > 0 ? posts[posts.length-1].id +1 : 1
    const AddPost={id:newid,title:postTitle,datetime: date,body:postBody}
    try{
    const response= await api.post('/posts',AddPost)
    const allposts =[...posts,response.data]
    setPosts(allposts)
    setPostTitle('')
    setPostBody('')
    navi('/')
    }catch(err)
    {
      console.log(err.message)
    }
  }
  const handleEdit = async (id) =>{
    const date=format(new Date(),  'MMMM dd, yyypp')
    const AddPost={id,title:editTitle, date,body:editBody}
    try{
      const response =  await api.put(`/posts/${id}`,AddPost)
      setPosts(posts.map(post => post.id===id ? {...response.data}:post))
    setPostTitle('')
    setPostBody('')
    navi('/')
      
    }catch(err)
    {
      console.log(err.message)
    }
  }
  const handleDelete = async (id) =>{
    try{
      const response = await api.delete(`/posts/${id}`)
    const delPosts = posts.filter( (post => post.id!==id))
    
    setPosts(delPosts)
    navi("/")
    }catch(err)
    {
      console.log(err.message)
    }
  
  }
  
  return (
    <div className="App">
      
      <Header title="Social Media App"/>
      <Nav search={search} setSearch={setSearch}/>
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />}  />
        <Route path="/newpost" >
          <Route index element={<NewPost handleSubmit={handleSubmit} postTitle={postTitle} setPostTitle={setPostTitle} postBody={postBody} setPostBody={setPostBody}/>} 
          />
          
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete}/>} />
        </Route>
        <Route path="/edit/:id" element={<EditPost posts={posts} handleEdit={handleEdit} editTitle={editTitle} setEditTitle={setEditTitle} editBody={editBody} setEditBody={setEditBody}/>} />
        <Route path="/about" element={<About/>} />
        <Route path="*" element={<Missing/>} />
      
      
      </Routes>

      
      <Footer />
    </div>
  );
}

export default App;
