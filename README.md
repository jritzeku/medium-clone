# medium-clone application

## DEMO!!!

This should cover most of the features/use cases.

https://www.youtube.com/watch?v=YlwLhb7eEYg

## Deployed on render.com

https://medium-clone-cxni.onrender.com

## Features/Use cases

-All users(members)

    ->Register
    ->Login

    ->View all stories
    ->View recommended stories
    ->View filtered stories(based on search criteria)

    ->View/publish/edit/delete story
    ->Save story as draft
    ->Publish story from existing draft

    ->Add/edit/delete comment
    ->Reply to comment (should be nested)

    ->Add/remove claps to story

    ->Follow/ unfollow user
    ->Subscribe/unsubscribe from topics/tags

    ->View/edit profile

    ->View/create/edit/delete list
    ->Save story to list
    ->Save other user's list

    ->View statistics on claps/views/stories
    ->Ability to toggle between stat type as well as month
	->Ability to adjust y-axis max/range

    ->Real-time notifications
    ->View notifications
    ->Mark notification(s) as read


## How to run locally

1. Create DB in MongoDB Atlas with following tables:

   ->users, tasks, projects

2. Create following .env file in root folder containing following:

---

MONGO_URI = (your mongodb connection string)

JWT_KEY = (some string)

CLOUDINARY_CLOUD_NAME = (your cloudinary creds)

CLOUDINARY_API_KEY=

CLOUDINARY_SECRET_KEY=

PORT = 5001

NODE_ENV= 'development'

---

3. Run 'npm i' in root folder, and 'npm i --force' in front end folder

4. Run 'npm run dev' in root folder
