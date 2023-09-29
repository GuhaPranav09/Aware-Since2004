# Style guide

- [Hooks](#Hooks)
- [Firestore Client](#Firstore-Client)
- [Rest API](#Rest-Api)

## Hooks

### Info

As a general rule of thumb separate "getter" hooks from "setter" hooks. E.g. use one hook to set the state and another to fetch that state.

### Example

Setting the state from the `useCheckForUpdates` hook


Getting the state by using the zustand state `useCodePushState(state => state.status)`


## Firstore Client

### Info

We use react-native-firbease/firestore in our project, as a general rule though, we decided to only use it in cases where we need live-updates.

You can read more about [how firestore snapshots work](https://rnfirebase.io/firestore/usage#realtime-changes), that's what we use for live data UX.

For the rest of database query operations we use our [REST API](#rest-api), which can aggregate and take further responsibility for how we provide data to our client.


## Rest API

### Info

A wrapping API layer enabling a centralized way of accessing and modifying data.
As most REST API we use the method from the request to indicate which operation to perform:

```
GET    /fruit         // Provides all the fruits Fruit[]
GET    /fruit/:id     // Provides a fruit based on the ID used Fruit
POST   /fruit         // Creates a new fruit
PUT    /fruit/:id     // Updates an exisitng fruit
DELETE /fruit/:id     // Deletes an exisitng fruit
```
