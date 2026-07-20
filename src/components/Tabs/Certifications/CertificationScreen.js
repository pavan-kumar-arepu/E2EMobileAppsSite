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
import aiBe10xPdf from "../../../assets/certifications/AI_Be10x_Certificate.pdf";
import edgeAiPdf from "../../../assets/certifications/Edge AI_Course Certificate - Pavan Kumar Arepu.pdf";
import googleEssentialsPdf from "../../../assets/certifications/Google Essentails Certification.pdf";
import googleProfessionalPdf from "../../../assets/certifications/Google Professional Certification.pdf";
import googleIcon from "../../../assets/certifications/googleIcon.png";

import styled from "styled-components";
import "./CertificationScreen.css";

const certificationCategories = [
  {
    category: "Artificial Intelligence",
    emoji: "🤖",
    color: "#6C3483",
    certs: [
      {
        id: 7,
        name: "AI for Everyone – Be10x",
        icon: null,
        emoji: "🧠",
        pdf: aiBe10xPdf,
        credentials: "AI Fundamentals & Productivity – Be10x",
      },
      {
        id: 8,
        name: "Edge AI",
        icon: null,
        emoji: "⚡",
        pdf: edgeAiPdf,
        credentials: "Edge AI Course Completion Certificate",
      },
      {
        id: 9,
        name: "Google Essentials",
        icon: googleIcon,
        pdf: googleEssentialsPdf,
        credentials: "Google Essentials Certification",
      },
      {
        id: 10,
        name: "Google Professional Certification",
        icon: googleIcon,
        pdf: googleProfessionalPdf,
        credentials: "Google Professional Certification",
      },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    emoji: "☁️",
    color: "#1A5276",
    certs: [
      {
        id: 1,
        name: "AWS Solutions Architect",
        icon: awsIcon,
        pdf: awsPdf,
        credentials: "AWS Certified Solutions Architect – Associate",
      },
      {
        id: 2,
        name: "Azure Fundamentals",
        icon: azureIcon,
        pdf: azurePdf,
        credentials: "Microsoft Certified: Azure Fundamentals",
      },
        
    ],
  },
  {
    category: "Mobile Development",
    emoji: "📱",
    color: "#145A32",
    certs: [
      {
        id: 4,
        name: "RxSwift",
        icon: rxswift,
        pdf: Rx_Swift,
        credentials: "Complete RxSwift Course Completion",
      },
      {
        id: 6,
        name: "Android using Kotlin",
        icon: kotlin,
        pdf: Android_Kotlin,
        credentials: "Complete Android 14 Course Completion with Kotlin",
      },
    ],
  },
  {
    category: "Software Engineering",
    emoji: "🏗️",
    color: "#784212",
    certs: [
      {
        id: 5,
        name: "SOLID Principles",
        icon: solid,
        pdf: solidpdf,
        credentials: "SOLID Principles – Deep Understanding",
      },
    ],
  },
  {
    category: "Agile & Process",
    emoji: "🔄",
    color: "#1B2631",
    certs: [
      {
        id: 3,
        name: "Professional Scrum Master",
        icon: psmIcon,
        pdf: psmPdf,
        credentials: "Scrum.org: Professional Scrum Master I (PSM I)",
      },
    ],
  },
];

const CategorySection = styled.div`
  margin-bottom: 36px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${(props) => props.color || "#ccc"};
`;

const CategoryTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => props.color || "#333"};
  margin: 0;
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const CertificationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 16px 10px;
  border-radius: 10px;
  transition: box-shadow 0.2s, transform 0.2s;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
  }
`;

const CertificationIcon = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const EmojiIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: ${(props) => props.bg || "#f0f0f0"};
  border-radius: 50%;
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
      {certificationCategories.map((group) => (
        <CategorySection key={group.category}>
          <CategoryHeader color={group.color}>
            <span style={{ fontSize: "1.4rem" }}>{group.emoji}</span>
            <CategoryTitle color={group.color}>{group.category}</CategoryTitle>
          </CategoryHeader>
          <CertificationsGrid>
            {group.certs.map((cert) => (
              <CertificationItem key={cert.id} onClick={() => openModal(cert.pdf)}>
                {cert.icon ? (
                  <CertificationIcon src={cert.icon} alt={`${cert.name} Icon`} />
                ) : (
                  <EmojiIcon bg={group.color + "22"}>{cert.emoji}</EmojiIcon>
                )}
                <CertificationDetails>
                  <h3 style={{ fontSize: "0.95rem" }}>{cert.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>{cert.credentials}</p>
                </CertificationDetails>
              </CertificationItem>
            ))}
          </CertificationsGrid>
        </CategorySection>
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
