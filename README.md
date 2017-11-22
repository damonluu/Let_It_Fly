# Let It Fly

“Let It Fly” provides services specifically for the users that need a quick access to ride to/from the airport. The services are offered in three different counties: Alameda, Santa Clara, and San Mateo. Let It Fly’s services are reliable, cheap, and convenient for all types of user. 

## Set Up Guide
### Tech Requirements:
* Operating System: Window or Linux
* Web Server: [node.js] 
* Database: [MySQL] 
* Client: Chrome and Safari
* Data: Sample data provided
* Other technologies: [AngularJS], [Express] ,[jQuery] ,[Bootstrap] 

### Installation & Configuration
1. Install all the required technology using [Homebrew] or software of your choice. (Refer to your User's Guide for more information) 
```
brew install node
brew install -g bower
brew install mysql
```
2. Log in your mysql on terminal after installing using Homebrew and created a new storage space for this project.
```
mysql -uroot 
GRANT ALL PRIVILEGES ON *.* TO ‘development’@’localhost’ IDENTIFIED BY ‘random’;
quit;
mysql -u development -p 
Password: random
```
3. Clone the project
```
git clone https://github.com/nguyenq2006/let_it_fly.git
```
3. Change directory to let_it_fly folder and start downloading all the dependencies and packages and start the web application
```
cd let_it_fly
bower install
npm install
npm start
```
4. Let It Fly is now accessible at: http://localhost:1600/

# Troubleshoot Resources
* If you are a Mac user and your app_db is not available after you run npm start, make sure to check if your MySQL server is on or if you installed MySQL correctly.
    - You can check by try logging in your root account
*	If you have port conflicts:
	- Lsof -i:1600 - show current process listening to that port   
	- Kill $(lsof -t -i:1600)
*   If you are a you cannot run npm start, check if you have installed Node JS
*	If you are a Window user and get ‘sh’ is not recognized, you will need to install git bash and use that instead of command prompt / other terminals

# Installation & Demo Video
* Installation: https://www.youtube.com/watch?v=H10H4A7lVcg
* App Demo: https://www.youtube.com/watch?v=OEjTUDlK9d0


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [node.js]: <http://nodejs.org>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   [Bootstrap]: <https://v4-alpha.getbootstrap.com/>
   [MySQL]: <https://www.mysql.com/>
   [Homebrew]: <https://brew.sh/>

