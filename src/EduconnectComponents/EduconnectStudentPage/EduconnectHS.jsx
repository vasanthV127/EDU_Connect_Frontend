import React from "react";
import "./EduconnectHS.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function EduconnectHS() {
  return (
    <div id="EduconnectHS-main">
      <div className="container-fluid">
        <div id="EducHS-Logo-row" className="row">
          <div
            id="EducHS-Logo-col"
            className="col d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="EducHS-FAQs-Text-row" className="row">
          <div
            id="EducHS-FAQs-Text-col"
            className="col d-flex justify-content-start align-items-center ps-4"
          >
            FAQ's
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="FAQs-section-row" className="row">
          <div className="col-12 d-flex justify-content-start align-items-center mb-3 ps-4 pe-4">
            <Accordion id="accordion-main">
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography id="accordion-header" component="span">
                  How to download resources?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography id="accordion-details">
                  Go to the <strong>Resources</strong> section of the website,
                  select your <strong>semester</strong>, and choose the relevant
                  subject. Find the file you need and click the{" "}
                  <strong>Download</strong> button. If the file is restricted,
                  ensure you have the necessary permissions or contact support.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="col-12 d-flex justify-content-start align-items-center mb-3 ps-4 pe-4">
            <Accordion id="accordion-main">
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography id="accordion-header" component="span">
                  How to reset my password?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography id="accordion-details">
                  Under Development
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="col-12 d-flex justify-content-start align-items-center mb-3 ps-4 pe-4">
            <Accordion id="accordion-main">
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography id="accordion-header" component="span">
                  How to upload course materials (Professors)?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography id="accordion-details">
                  Professors can log in to their accounts, navigate to the
                  <strong> Upload Materials</strong> section, select the
                  respective semester, choose the subject, and upload the
                  required files. Ensure that the file format is supported and
                  does not exceed the size limit.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="col-12 d-flex justify-content-start align-items-center mb-5 ps-4 pe-4">
            <Accordion id="accordion-main">
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography id="accordion-header" component="span">
                  Who to contact for technical issues?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography id="accordion-details">
                  For any technical issues, reach out to the Support Team via
                  email at <strong>theeduconnect.team@gmail.com</strong> or Write a issue
                  description.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div
            id="Educ-FAQs-short-message"
            className="col-12 d-flex justify-content-center align-items-center mb-4 ps-4 pe-4"
          >
            <p>Still have questions? Reach out to us!</p>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="Educ-Queries-sec-row" className="row">
          <div
            id="Educ-Queries-sec-col"
            className="col-12 d-flex justify-content-center align-items-center text-center ps-4 pe-4 mb-4"
          >
            <p>
              If you need assistance, feel free to reach out! Use the form below
              to submit your query, and our team will respond promptly.{" "}
              <strong>
                If you encounter any errors during login, downloads, or other
                actions, please attach a screenshot of the issue to help us
                resolve it faster.
              </strong>
            </p>
          </div>
        </div>
        <div id="Educ-Queries-boxes-row" className="row">
          <div
            id="Educ-Queries-boxes-col"
            className="col-12 d-flex justify-content-center align-items-center text-center mb-4 ps-4 pe-4"
          >
            SUBMIT YOUR QUERY
          </div>
        </div>
        <div id="Educ-Queries-boxes-sub-row" className="row">
          <div
            id="Educ-Queries-boxes-sub-col"
            className="col-12 gap-3 d-flex flex-column justify-content-center align-items-center text-center mb-5 ps-4 pe-4"
          >
            <input type="text" placeholder="Name" />
            <input type="email" name="E-mail" placeholder="E-Mail" />
            <input type="text" placeholder="Subject" />
            <textarea
              id="message"
              name="message"
              rows="5"
              cols="50"
              placeholder="Type your message here..."
            ></textarea>
            <input type="file" name="File" placeholder="Attach a File" />
            <button id="Educ-submit-query-btn" type="button">
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="Educ-contact-row" className="row">
          <div
            id="Educ-contact-col"
            className="col-12 d-flex flex-column justify-content-center align-items-center mb-4 ps-4 pe-4"
          >
            <p id="Educ-contact-header">Help & Contact Support</p>
            <p id="Educ-contact-Email">
              <strong>Email:</strong>{" "}
              <a href="mailto:theeduconnect.team@gmail.com">theeduconnect.team@gmail.com</a>
            </p>
            <p id="Educ-contact-Phone">
              <strong>Phone:</strong> +91 9177273668 (9 AM - 5 PM EST)
            </p>
          </div>
        </div>
      </div>
      <footer>
        <div className="container-fluid">
          <div id="Educ-footer-HS-row" className="row">
            <div
              id="Educ-footer-HS-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mb-4 ps-4 pe-4"
            >
              &copy; {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EduconnectHS;
