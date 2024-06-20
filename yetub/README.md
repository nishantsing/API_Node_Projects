# Project Yetub Node API

[YT - Complete Backend Series- Hitesh](https://youtu.be/nhmMx-ys_zQ)

## Create Yetub ER diagram using eraser

```
videos [icon: video, color: blue] {
  id string pk
  videoFile string
  thumbnail string
  owner ObjectId
  title string
  description string
  duration number
  views number
  isPublished boolean
  createdAt Date  
  updatedAt Date
}

users [icon: user, color: blue] {
  id string pk
  watchHistory objectId[]
  username string
  email string
  fullName string
  avatar string
  coverImage string
  password string
  refreshToken string
  createdAt Date
  updatedAt Date
}

comments [icon: comment] {
  id string pk
  content string
  createdAt Date
  updatedAt Date
  video ObjectId
  owner ObjectId
}

playlists [icon: play] {
  id string pk
  name string
  description string
  createdAt Date
  updatedAt Date
  videos objectId[]
  owner objectId
}

tweets [icon: twitter, color: blue] {
  id string pk
  owner ObjectId
  content string
  createdAt Date
  updatedAt Date
}

subscriptions [icon: money, color: green] {
  id string pk
  subscriber ObjectId
  channel ObjectId
  createdAt Date
  updatedAt Date
}

likes [icon: thumbs-up, color: blue]{
  id string pk
  comment ObjectId
  video ObjectId
  createdAt Date
  updatedAt Date
  likedBy ObjectId
  tweet ObjectId
}

users.watchHistory <> videos.id

videos.owner - users.id

subscriptions.subscriber - users.id
subscriptions.channel  - users.id

likes.likedBy - users.id
likes.video  - videos.id
likes.comment - comments.id
likes.tweet  - tweets.id

comments.owner - users.id
comments.video - videos.id

playlists.owner - users.id
playlists.videos < videos.id 

tweets.owner - users.id
```

## Project Structure

[YT - Backend Project Structure - Hitesh](https://youtu.be/eDHl26DWrk4)

src/index.js
cd src
mkdir controllers db middlewares models routes utils
touch app.js index.js constants.js .env .env.sample readme.md
touch db/index.js
cd models
touch comment.models.js like.models.js playlist.models.js subscription.models.js tweet.models.js  user.models.js  video.models.js


#### prettier dev dependency

.prettierignore
```
/.vscode
/node_modules
./dist

*.env
.env
.env.*
```

.prettierrc
```
{
  "singleQuote":false,
  "bracketSpacing":true,
  "tabWidth":2,
  "trailingComma":"es5",
  "semi":true
}

```