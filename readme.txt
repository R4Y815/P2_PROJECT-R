Things to do(in sequence)
0) Data Validation!

1) Lap timing doesn't disply properly if user keys in 10.00.010.. (becomes. 10.undefined.010)

2) insert photos for RC Track layouts
  - probably make it such that the photo of the RC track can float over when the user clicks in and looks at the RC Track.  

3) Rework display layout for Tracktimes-scuh that using selects setup and the chassis name, type of chassis is automaticaloly displayed- it makes more sense- rather than having the user reselect that again. 

4) CSS layout! it needs to be really optimissed for mobile usage. 
   Right now, the NewSetups page is still too wide for mobile because of the display of the parameters. 

5) Future: Allow users to upload Photos of their chassis layout to be 
  able to see and refer to their electronics layout. 

Feedback from code review: 
6) Clean up the repo on Github, organise into fodlers for same document types and remove  
   the files that you don't need.

7) git commit messages could be shorter

8) delete commented out code, you can get it from git history.

9) Line 82,116 makes more sense to explain in a comment what this line is doing. ( can make the explanation more descriptive and elaborate)

10) Line 93 Helper Fn is a good example of the level of commenting and how to explain your code in a comment.

11) Line 207 - 210 can remove ( left for maintenance, please make notes: )

12) Line 267- for querys that have same make sure to store it as a variable. 

13) Line 372 remove, 

14) always think about how to make the readability better for the other programmer... lines 456 has too many console logs. 

15) remove the unused codes or commented out items. 