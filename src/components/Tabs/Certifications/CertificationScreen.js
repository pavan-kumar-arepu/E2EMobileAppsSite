import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import awsIcon from "../../../assets/certifications/AWSSoluationIcon.png";
import awsPdf from "../../../assets/certifications/AWSSoluationArchitectFull.pdf";
import azureIcon from "../../../assets/certifications/AzureFundamentalsIcon.png";
import azurePdf from "../../../assets/certifications/AzureFundamentalsFull.pdf";
import psmPdf from "../../../assets/certifications/PSM1.pdf";
import psmIcon from "../../../assets/certifications/psm1logo.png";

import rxswift from "../../../assets/certifications/rxswift.png";
import Rx_Swift from "../../../assets/certifications/Rx_Swift.pdf";

import solid from "../../../assets/certifications/Solid.png";
import solidpdf from "../../../assets/certifications/SolidP.pdf";

import kotlin from "../../../assets/certifications/kotline.png";
import Android_Kotlin from "../../../assets/certifications/Android_Kotline.pdf";

import styled from "styled-components";
import "./CertificationScreen.css";

const certifications = [
  {
    id: 1,
    name: "AWS Solutions Architect",
    icon: awsIcon,
    pdf: awsPdf,
    credentials: "AWS Certified Solutions Architect - Associate",
  },
  {
    id: 2,
    name: "Azure Fundamentals",
    icon: azureIcon,
    pdf: azurePdf,
    credentials: "Microsoft Certified: Azure Fundamentals",
  },
  {
    id: 3,
    name: "Professional Scrum Master",
    icon: psmIcon,
    pdf: psmPdf,
    credentials: "Scrum Certified: Professional Scrum Master - 1",
  },
  {
    id: 4,
    name: "RxSwfit",
    icon: rxswift,
    pdf: Rx_Swift,
    credentials: "A complete Rx-Swift Course completed",
  },
  {
    id: 5,
    name: "Solid Principles",
    icon: solid,
    pdf: solidpdf,
    credentials: "A Solid understanding of SoliD Principles",
  },
  {
    id: 6,
    name: "Android using Kotlin",
    icon: kotlin,
    pdf: Android_Kotlin,
    credentials: "A Complete Android 14 Course Completion with Kotlin",
  },
  // Add more certifications as needed
];

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const CertificationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const CertificationIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;

const CertificationDetails = styled.div`
  text-align: center;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: auto;
  padding: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Certifications = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const openModal = (pdf) => {
    setSelectedPdf(pdf);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPdf(null);
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="certifications">
      <CertificationsGrid>
        {certifications.map((cert) => (
          <CertificationItem key={cert.id} onClick={() => openModal(cert.pdf)}>
            <CertificationIcon src={cert.icon} alt={`${cert.name} Icon`} />
            <CertificationDetails>
              <h3>{cert.name}</h3>
              <p>{cert.credentials}</p>
            </CertificationDetails>
          </CertificationItem>
        ))}
      </CertificationsGrid>

      {modalIsOpen && (
        <>
          <ModalOverlay onClick={closeModal} />
          <ModalContent>
            <button onClick={closeModal}>Close</button>
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={selectedPdf}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </ModalContent>
        </>
      )}
    </div>
  );
};

export default Certifications;
