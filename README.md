<h1 align="center">medium-clone</h1>

## DEMO!!!

A blog application containing most of the core functionalities as medium.com.
    &nbsp;
This should cover most of the features/use cases.

https://www.youtube.com/watch?v=YlwLhb7eEYg

## Deployed on render.com

https://medium-clone-cxni.onrender.com

## Features/Use cases

-All users(members)

- [x] Register
- [x] Login
<br>

- [x] View all stories
- [x] View recommended stories
- [x] View filtered stories(based on search criteria)
<br>

- [x] View/publish/edit/delete story
- [x] Save story as draft
- [x] Publish story from existing draft
<br>

- [x] Add/edit/delete comment
- [x] Reply to comment (should be nested)
<br>

- [x] Add/remove claps to story
- [x] Prevent inflating own stats; cant clap or increment views/reads on own story
<br>

- [x] Follow/ unfollow user
- [x] Subscribe/unsubscribe from topics/tags
<br>

- [x] View/edit profile
<br>

- [x] View/create/edit/delete list
- [x] Save story to list
- [x] Save other user's list
<br>

- [x] View statistics on claps/views/stories
- [x] Ability to toggle between stat type as well as month
- [x] Ability to adjust y-axis max/range
<br>

 
- [x] Real-time notifications
- [x] View notifications
- [x] Mark notification(s) as read
- [x] Notifications categorized 

## How to run locally

1.  Create DB in MongoDB Atlas with following tables:

         ->users, stories, views, reads, claps, comments ,drafts, lists, notifications

2.  Create .env file in root folder containing following:

        MONGO_URI = (your mongodb connection string)

        JWT_KEY = (some string)

        CLOUDINARY_CLOUD_NAME = (your cloudinary cred)

        CLOUDINARY_API_KEY= (your cloudinary cred)

        CLOUDINARY_SECRET_KEY= (your cloudinary cred)

        PORT = 5001

        NODE_ENV= 'development'

3.  Install dependencies.

    > 'npm i' //in root folder,

    > 'npm i --force' //in front end folder

    NOTE: The reason for using the 'force' flag is because currently having some issues with React versions
    &nbsp;

4.  Create following folders to upload files/images during creation/edit of resources. Unfortunately github does not allow us to push 'public' folders.

    > public/images/posts
    > public/images/users

Once done, should look like this:

    public/images
      >posts
      >users

5. Seed DB with following command in root directory:

   > 'npm run data:import'
   > &nbsp;

6. START our application!(runs both client and server concurrently)

   > 'npm run dev' //in root folder
