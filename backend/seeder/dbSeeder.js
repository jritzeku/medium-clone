const mongoose = require('mongoose')
const dotenv = require('dotenv')
const stories = require('./data/stories')
const users = require('./data/users')
const User = require('../models/User')
const Story = require('../models/Story')
const Comment = require('../models/Comment')
const Clap = require('../models/Clap')
const List = require('../models/List')

const View = require('../models/View')
const Read = require('../models/Read')

const convertStringToHTML = require('../utils/textToHtml')

const connectDB = require('../config/db/connectDB')

dotenv.config()

connectDB()

const clearDB = async () => {
  try {
    //be CAREFUL of order of operation! Story, User should be last to delete

    await List.deleteMany()
    await Clap.deleteMany()
    await Comment.deleteMany()
    await View.deleteMany()
    await Read.deleteMany()
    await Story.deleteMany()
    await User.deleteMany()

    console.log('Resetting the DB, all documents deleted.')
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}

const importData = async () => {
  let userIndex = 0
  await clearDB()  

  //Add users
  const createdUsers = await User.insertMany(users)

 

  //----------------------------------------- Add stories-----------------------------------------
  let storiesWithUsers = []
  for (let i = 0; i < stories.length; i++) {
    //NOTE: 0%4 = 0; we want to check against this else will be out of bounds for user
    if (i > 0 && i % 4 === 0) {
      userIndex++
    }

    stories[i].content = stories[i].content + stories[i].content

    //WONT work...will keep reassigning to latest element
    // storiesWithUsers =[{ ...stories[i], user: createdUsers[userIndex].id }]
    storiesWithUsers.push({
      ...stories[i],
      user: createdUsers[userIndex].id,
      nameOfUser: `${createdUsers[userIndex].firstName} ${createdUsers[userIndex].lastName}`,
    })
  }

  await Story.insertMany(storiesWithUsers)

  //----------------------------------------- Add claps,views, reads-----------------------------------------
  let updatedStories = await Story.find({})

  let startingClapperPos = createdUsers.length - 1

  let clap
  // let view
  // let read
  let currUser

  for (let i = 0; i < updatedStories.length; i += 4) {
    /*
    -Adding claps
      ->since user cant add claps to own post, we simply iterate through in reverse order
      when adding to clap model
    */

    currUser = createdUsers[startingClapperPos--]._id
    clap = await Clap.create({
      clapsByUser: Math.ceil(Math.random() * 5),
      user: currUser,
      story: updatedStories[i]._id,
      //    createdAt: new Intl.DateTimeFormat('en-US').format(new Date(`06/1/2023`)),
      createdDate: new Date(`03/1/2023`),
    })

   

    updatedStories[i].claps.push(clap)

    await updatedStories[i].save()
  }

  /*
  -----------------------------------------   Add recommended topics for users-----------------------------------------
    ->prevent following same topic again
  */

  let allUsers = await User.find({})

 
  let allTopics = [...new Set(updatedStories.map((story) => story.tags).flat())]
 
  for (let i = 0; i < allUsers.length; i++) {
    let topicsNotFollowed = [...allTopics]

    for (let j = 0; j < 5; j++) {
      let selectedIndex = Math.floor(Math.random() * topicsNotFollowed.length)
      allUsers[i].recommendedTopics.push(topicsNotFollowed[selectedIndex])
 
      topicsNotFollowed.splice(selectedIndex, 1) //use splice()
    }
  }

  for (let i = 0; i < allUsers.length; i++) {
    await allUsers[i].save()
  }

  /*
-----------------------------------------   Add following/followers -----------------------------------------
 
  ->prevent following own self
  ->prevent following same user again 
*/

  let allUsers2 = await User.find({})

  let usersNotFollowed = [...allUsers.map((user) => user._id)]

  console.log('usersNotFollowed: ', usersNotFollowed)

  for (let i = 0; i < allUsers.length; i++) {
    //remove own id from here; so instead 12 we get 11 users
    let usersNotFollowed = [...allUsers.map((user) => user._id)].filter(
      (user) => user._id !== allUsers[i]._id
    )

    for (let j = 0; j < 6; j++) {
      let selectedIndex = Math.floor(Math.random() * usersNotFollowed.length)
      /*
      NOTE:
      each user will have 5 for following but their followers
      will vary due to our logic !!! 
      */

      //Update my following array
      allUsers2[i].following.push(usersNotFollowed[selectedIndex])
      // await allUsers2[i].save()

      //Update their followers array
      await User.findByIdAndUpdate(usersNotFollowed[selectedIndex], {
        $push: { followers: allUsers2[i]._id },
      })

      usersNotFollowed.splice(selectedIndex, 1)
    }
  }

  for (let i = 0; i < allUsers.length; i++) {
    await allUsers2[i].save()
  }

  /*
  -----------------------------------------   Add Default 'reading list' for users-----------------------------------------
  */

  let allUsers3 = await User.find({})
  let list
  for (let i = 0; i < allUsers3.length; i++) {
    list = await List.create({
      name: 'Reading',
      description: 'General reading list(default)',
      user: allUsers3[i]._id,
      isDefault: true,
      isPrivate: false,
    })

    allUsers3[i].readingLists.push(list)
    await allUsers3[i].save()
  }
 

  //Adding claps
 

  //Adding more views,reads, claps for 'John' so we can see data on graph

  let targetUser = await User.findOne({ firstName: 'John', lastName: 'Doe' })
  let targetUserStories = await Story.find({ user: targetUser._id })

 
  let otherUsers = await User.find({ _id: { $ne: targetUser._id } })

 
 

  /*  
  -If i OMIT the 'await' keyword, then it will start inserting monthly data without waiting for
  month to finish; more performant??

    ->however in DB then it will not be in order(physically), would see data like this:
    
      -june1, july1 ,aug1, june2 , july 2, aug2 etc.
  */
  await addStats(targetUserStories, otherUsers, 3)
  await addStats(targetUserStories, otherUsers, 3)

  await addStats(targetUserStories, otherUsers, 4)
  await addStats(targetUserStories, otherUsers, 4)

  await addStats(targetUserStories, otherUsers, 5)
  await addStats(targetUserStories, otherUsers, 5)

  console.log(
    '--------------------  Data has been successfully imported. -------------------- '
  )
}

const addStats = async (targetUserStories, otherUsers, month) => {
  for (let i = 0; i < otherUsers.length; i++) {
    let targetUserStory = targetUserStories[Math.ceil(Math.random() * 3)]

    //create view
    await View.create({
      viewsCount: Math.ceil(Math.random() * 10),
      user: otherUsers[i]._id,
      story: targetUserStory._id,
      storyAuthor: targetUserStory.user,
      createdDate: new Date(`${month}/${Math.ceil(Math.random() * 28)}/2023`),
    })

    //create readF
    await Read.create({
      readsCount: Math.ceil(Math.random() * 10),
      user: otherUsers[i]._id,
      story: targetUserStory._id,
      storyAuthor: targetUserStory.user,
      createdDate: new Date(`${month}/${Math.ceil(Math.random() * 28)}/2023`),
    })

    //create clap
    await Clap.create({
      clapsByUser: Math.ceil(Math.random() * 5),
      user: otherUsers[i]._id,
      story: targetUserStory._id,
      storyAuthor: targetUserStory.user,

      createdDate: new Date(`${month}/${Math.ceil(Math.random() * 28)}/2023`),
    })
  }
}

const destroyData = async () => {
  await clearDB()
  process.exit()
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

 
 