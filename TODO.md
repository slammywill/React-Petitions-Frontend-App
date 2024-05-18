# Searching Petitions

## U1 Search
- [x] The user can type a word or phrase into an appropriate search box to search for specific petitions.
- [x] Only, and all, petitions whose title or description contains the provided characters, word(s), or phrase are shown (possibly after using pagination).
- [x] The results should be shown as described in Story 2 with the possibility of being filtered as described in Story 3.

## U2 List of Petitions
- [x] Basic information about each petitions should be visible.
- [x] All petitions should be shown (possibly after using pagination).

## U3 Filter
- [x] The user can select one or more options (e.g., category Wildlife or Education and supporting cost <= $15) to filter by.
- [x] The user can use no filter, filter by category, filter by supporting cost, or both.
- [x] Only petitions that match at least one of the categories should be shown (possibly after using pagination).
- [x] Only petitions that have a supporting cost less than or equal to should be shown (possibly after using pagination).

## U4 Sort
- [x] By default, petitions must be ordered according to when they were released, from oldest to newest (This is the default provided by the server CREATED_ASC).
- [x] The user can choose to sort the petitions in one of the following ways ...

## U5 Pagination
- [x] If there are more than 10 petitions in the list, then the user should only see the first 10 to begin with. I.e. petitions 1-10.
- [x] The user can choose to view the next batch of 10 (if there are additional petitions), i.e. petitions 11-20. In this way the user should be able to look through all the petitions 10 at a time.
- [x] The user can choose to view the previous batch of 10, where the user has progressed beyond the first 10 petitions. For example of the user is viewing petitions 21-30, they can ’page back’ to petitions 11-20.
- [x] The user can choose to progress to the first page (i.e. petitions 1-10) if they are not already on that page.
- [x] The user can choose to progress to the last page if they are not already there.
- [x] The user should be able to see the index of the current page, where the index starts at 1. petitions 1-10 are on page 1, 11-20 are on page 2, etc...
- [x] The user should be able to see when there are no more petitions. There should be an indication that the last page has been reached, and they should not be able to travel to any pages beyond this.
- [x] The last page may contain less than 10 petitions. For example, if there are 25 petitions, the pages should contain 1-10, 11-20, 21-25 respectively.

## U6 Combination
- [x] The user should be able to select multiple options, and this should result in all of them being applied. For example, if the user searches for "Green", filters by "Wildlife" category and supporting cost <= $0, and sorts by "ascending alphabetically". Then only petitions with "Green" in the title or description and category "wildlife" and a supporting cost of $0 should be displayed sorted A-Z by title.

# Viewing a Petition

## U7 Viewing a Petition
- [x] There should be an easy way to reach these details from the list of petitions described in Story 1 (such as a link from the list of petitions, this information will not count if it is only displayed in the list).
- [x] All information about the petitions should be visible, composed of...
- [x] The available support tiers can be in any order, and need not take the specific form of a list.
- [x] The list of supporters must be ordered by most recent to oldest (this is the default of the server), this may be done for a list of support tiers or ordering them within individual lists for each support tier. The whole list doesn’t need to be initially shown, but if not, there must be some way to easily see the list without leaving the page (e.g., a modal popup, or a hide/show button).

## U8 Similar Petitions
- [x] A list of similar petitions should also be displayed in the petition details page. A similar petition is any other petition with the same category as the currently viewed petition, or has the same owner.
- [x] Similar petitions should be displayed with the same information as Story 2.

# Registering and Logging In

## U9 Register
- [x] Any person who is not already logged in can register by providing a first name, last name, email address, and password. Optionally they can also provide a profile picture (JPEG, PNG, or GIF).
- [x] The email address must not already be in use by another user.
- [x] The email address must be syntactically valid (must contain an @ and a top-level domain e.g., "a@b.c").
- [x] The password must be at least 6 characters in length.
- [x] The password must not be displayed in plaintext (i.e., it should be obscured by representing each character as a dot or star). However, users may click a button to toggle the ability to view the password field.
- [x] Upon successfully registering, the user is immediately logged in.

## U10 Log In
- [x] A user must be able to log in to the application using their email address and password. Any subsequent action they take (e.g., creating a new petition) will be related to their account.
- [x] A user must not be able to log in to an account without providing both the correct email address and password of that account.
- [x] A logged-in user cannot log in again, without first logging out.

## U11 Log Out
- [x] A logged-in user may log out, which causes them to no longer be authenticated.
- [x] A user that is not currently logged in cannot log out.

# Managing Petitions

## U12 Create
- [x] The user must first be logged in.
- [x] The user must provide valid information to create the petition (with required attributes bolded).
    - Title – Must be unique.
    - Description
    - CategoryId – Must reference a category accepted by the server.
    - supportTiers – There must be between 1-3 (inclusive) support tiers provided.
    - Image – Must only accept png, jpeg, gif
- [x] The petition must then be included in the list of auctions and works with searching, filtering, sorting, and pagination.

## U13 Edit
- [ ] Only the owner of the petition can edit it.
- [ ] Basic information (title, description and categoryId) may be changed at any time.
- [ ] Support tiers:
    - May only be added, if the petition currently has less than 3 support tiers.
    - May only be updated, if the specified support tier has no supporters.
    - May only be deleted, if the specified support tier has no supporters and the petition currently has more than 1 support tier.

## U14 Delete
- [x] Only the owner of a petition can delete it.
- [x] The owner must be prompted to confirm the action.
- [x] A petition can not be deleted once a supporter has supported at any tier.

## U15 My Petitions
- [x] A registered user must have some way of viewing only and all the petitions they are ’involved’ with, either as a owner or a supporter.
- [x] Each petition must be shown with the same information that can be seen from the list of petitions in Story 2 (there are no requirements for searching, filtering, sorting, or pagination). 
- [x] There should be an easy way to view the details of any of these petitions (Story 7).

# Supporting a Petition

## U16 Supporting
- [ ] Should the user be interested in supporting a petition the user should be able to support at a given tier from the petition details page.
- [ ] Only an authenticated user may support a petition. Casual users should be prompted to log in or register.
- [ ] Users can support a petition without leaving a message.
- [ ] An owner can not support their own petition.
- [ ] A user cannot change or delete their support.
- [ ] A user may support a petition at any number of its tiers, however a user can only support at each unique tier once.

# Managing User Profile

## U17 View
- [ ] An authenticated user can view their own information, composed of:
    - First name
    - Last name
    - Email
    - Profile picture (or a default one, if none exists)
- [ ] No one else can view another user’s information (except when it it included as part of a petition where they are the owner or a supporter, in either case only the user’s first and last name and profile picture are displayed).

## U18 Edit
- [ ] An authenticated user can edit their own information. This can be any of:
    - Profile picture
    - First name
    - Last name
    - Email
    - Password
- [ ] If a profile picture exists it can be removed.
- [ ] The email address must not already be in use by another user.
- [ ] The email address must be syntactically valid (See Story 9).
- [ ] If the password is being updated, the existing password must be provided and correct.
- [ ] The password must be at least 6 characters.
- [ ] The password must not be displayed in plain text (See Story 9).
- [ ] A user can not modify another user’s information.
