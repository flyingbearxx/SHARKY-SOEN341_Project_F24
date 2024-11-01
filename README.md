# SHARKY-SOEN341_Project_F24 &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hlbels/SHARKY-SOEN341_Project_F24/blob/main/LICENSE)

## Identified Problem  
As students, we are often working in group projects, where collaboration is the key to success. University team projects often struggle with imbalanced participation, unclear roles, and unfair grading due to the lack of effective tools to properly evaluate each member's individual contribution. 

## Offered Solution & Project Description  
The SHARKY Peer Assessment web application is developed by university students, for university students. It provides a platform for students to anonymously assess their teammates based on four key dimensions: cooperation, conceptual contribution, practical contribution, and work ethic. SHARKY is designed to provide students with a dynamic environment to provide constructive feedback. Our product will bridge the gap between individual contribution and group accountability, ensuring that every student's effort is recognized. It is by facilitating transparent evaluation practices that SHARKY helps promote fairer grading while providing crucial insights to both students and their instructors. SHARKY fosters a culture of continuous improvement, empowering students to reflect on their performance, and contribute more effectively to their teams.  

### Features  
- Anonymous peer assessment where students rate their peers using a detailed 5-point scale and comments to support their evaluation.
- Instructor Dashboard offers a comprehensive overview of the peer assessment results and the option to export its data in CSV format. 
- Instructors can create teams using the Instructor Dashboard, or via CSV import.
- Instructors have broad oversight of the students in their class and the breakdown of all the teams. 
- Users can reset their password if they forgot it, via an email link.

### Project Goals
SHARKY aims to: 
- Empower students to provide fair and constructive feedback to their peers.
- Offer instructors a reliable tool to monitor and analyze team dynamics.
- Enhance accountability within team projects.

### Technologies
- **Frontend**: HTML/CSS, Javascript, React.js, JSX
- **Backend/Database**: Supabase

## Installation Procedure
Prerequisites:  
Before you begin, ensure you have the following installed:

1) Node.js: Download and install Node.js from [here](https://nodejs.org/en/download/prebuilt-installer).  
2) Git:Download and install Git from Git's official site, if not already installed.  
  
**Step 1: Clone the repository** 
First, clone the SHARKY project repository to your local machine using Git. Open your terminal and run the following command:

```bash
git clone https://github.com/khujista-01/SHARKY-SOEN341_Project_F24.git  
```

**Step 2: Navigate to the Project Directory**  
Navigate to the SHARKY-SOEN341_Project_F24\Sharky directory.  

```bash
cd SHARKY-SOEN341_Project_F24/Sharky
```  
  
**Step 3: Verify Node.js Installation**  
To confirm that Node.js is installed correctly, execute the following commands:

```bash
node -v
npm -v
```

This will display the versions of Node.js and npm installed, which should meet the prerequisites mentioned earlier.  
  
**Step 3: Install Dependencies**  
Install all the revelent dependencies using the following command: 

```bash
npm install
```
This command will install all dependencies listed in the package.json file, including React and Supabase client libraries, ensuring your application has all it needs to run properly.  

**Step 4: Run the Application**  
Once the installation is complete, you can start the application locally by using the following command: 
```bash
npm run start
```

This command will start the React development server and open the SHARKY Peer Assessment Platform in your default web browser, typically accessible via http://localhost:3000/. Enjoy!  


## SHARKY Members

|**NAME**|**STUDENT ID**|**ROLE**|
|--------|--------------|--------|
|Shaili Hakimpour|40201808|Full Stack developer|
|Hala Belamri|40221036|Full Stack developer|
|Ana Rostam|40187433|Full Stack developer|
|Raghda Elkei|40251216|Full Stack developer|
|Khujista Faqiri|40249541|Full Stack developer|
|Yasmeen Adi|40223656|Full Stack developer|

## License 
SHARKY Peer Assessment is [MIT Licenced](./LICENSE).
