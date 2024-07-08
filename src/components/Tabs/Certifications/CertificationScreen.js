import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import awsIcon from "../../../assets/AWSSoluationIcon.png";
import awsPdf from "../../../assets/AWSSoluationArchitectFull.pdf";
import azureIcon from "../../../assets/AzureFundamentalsIcon.png";
import azurePdf from "../../../assets/AzureFundamentalsFull.pdf";
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
  // Add more certifications as needed
];

const CertificationItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const CertificationIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const CertificationDetails = styled.div`
  flex: 1;
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
      {certifications.map((cert) => (
        <CertificationItem key={cert.id} onClick={() => openModal(cert.pdf)}>
          <CertificationIcon src={cert.icon} alt={`${cert.name} Icon`} />
          <CertificationDetails>
            <h3>{cert.name}</h3>
            <p>{cert.credentials}</p>
          </CertificationDetails>
        </CertificationItem>
      ))}

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
