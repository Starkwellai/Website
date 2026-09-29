export function HipaaContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">HIPAA Notice of Privacy Practices</h2>
        <p className="mb-3">
          <strong>Effective Date:</strong> March 23, 2026
        </p>
        <p className="mb-3">
          This Notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.
        </p>
        <p>
          Starkwell is committed to protecting your health information and to building toward full
          compliance with the Health Insurance Portability and Accountability Act (HIPAA).
        </p>
      </section>

      <section className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h2 className="text-lg font-semibold text-amber-900 mb-2">Where things actually stand today</h2>
        <p className="mb-2 text-sm">
          Starkwell doesn't yet store diagnoses, treatment history, or insurance claims — today
          this is a public price-comparison tool, plus an appointment-request inbox that shares
          only the name, contact info, and optional note a patient chooses to send a practice.
          We never sell your data and never share it without consent.
        </p>
        <p className="text-sm">
          Full HIPAA-level infrastructure — encryption at rest, signed agreements with every
          vendor, audit logging, a named security officer, a completed risk assessment — is real
          work we're building toward, not something already in place. The rest of this Notice
          describes that target state; nothing here should be read as a claim that every safeguard
          described below is live today.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">1. Our Commitment to Your Privacy</h2>
        <p className="mb-3">
          We understand that your health information is personal and sensitive. We are committed to protecting your health information and maintaining its confidentiality. This Notice of Privacy Practices describes our legal duties and privacy practices with respect to your protected health information (PHI).
        </p>
        <p>
          Protected Health Information (PHI) means information about you, including demographic information, that may identify you and relates to your past, present, or future physical or mental health condition and related healthcare services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">2. How We May Use and Disclose Your Health Information</h2>
        <p className="mb-3">
          The following categories describe the different ways we may use and disclose your health information without your written authorization:
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.1 For Treatment</h3>
        <p className="mb-3">
          We may use and disclose your health information to facilitate medical treatment or services by healthcare providers. This includes coordination of care and consultations between providers regarding your treatment.
        </p>
        <p className="mb-3">
          <strong>Example:</strong> When you request an appointment through a claimed listing, we send the practice the name, contact info, and any note you chose to include — not a medical record, since Starkwell doesn't hold one.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.2 For Payment</h3>
        <p className="mb-3">
          We may use and disclose your health information to facilitate payment for healthcare services you receive. This includes billing, claims management, and determining eligibility for coverage.
        </p>
        <p className="mb-3">
          <strong>Example:</strong> We may provide your insurance information to a healthcare provider to verify coverage and determine the cost of services.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.3 For Healthcare Operations</h3>
        <p className="mb-3">
          We may use and disclose your health information for our healthcare operations, which include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Quality assessment and improvement activities</li>
          <li>Training programs for healthcare professionals</li>
          <li>Accreditation, certification, licensing, or credentialing activities</li>
          <li>Business planning and development</li>
          <li>Conducting or arranging for medical review, legal services, and auditing functions</li>
        </ul>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.4 Business Associates</h3>
        <p className="mb-3">
          We may disclose your health information to our business associates who perform functions on our behalf or provide services to us. We require these business associates to appropriately safeguard your health information through written agreements.
        </p>
        <p className="mb-3">
          <strong>Example:</strong> AI-assisted search isn't live yet. When it launches, any AI vendor we use for it will need a signed business-associate agreement in place first — not something we're claiming exists today.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.5 As Required by Law</h3>
        <p className="mb-3">
          We will disclose your health information when required to do so by federal, state, or local law, including reporting requirements for public health activities, abuse, or neglect.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">3. Uses and Disclosures That Require Your Authorization</h2>
        <p className="mb-3">
          Other than as described in this Notice, we will not use or disclose your health information without your written authorization. Some examples that require authorization include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Marketing communications (unless it's for face-to-face communication or promotional gifts of nominal value)</li>
          <li>Sale of your health information</li>
          <li>Most uses and disclosures of psychotherapy notes</li>
          <li>Uses and disclosures for purposes not otherwise described in this Notice</li>
        </ul>
        <p>
          You may revoke your authorization at any time by submitting a written request to our Privacy Officer. The revocation will not affect any uses or disclosures already made in reliance on your authorization.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">4. Your Rights Regarding Your Health Information</h2>
        <p className="mb-3">
          You have the following rights with respect to your protected health information:
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.1 Right to Inspect and Copy</h3>
        <p className="mb-3">
          You have the right to inspect and obtain a copy of your health information that may be used to make decisions about your care. We may charge a reasonable fee for the costs of copying, mailing, or other supplies associated with your request.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.2 Right to Amend</h3>
        <p className="mb-3">
          If you feel that health information we have about you is incorrect or incomplete, you may ask us to amend the information. You have the right to request an amendment for as long as the information is kept by or for Starkwell.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.3 Right to an Accounting of Disclosures</h3>
        <p className="mb-3">
          You have the right to request an "accounting of disclosures," which is a list of certain disclosures we made of your health information. The list will not include all disclosures, such as those made for treatment, payment, or healthcare operations.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.4 Right to Request Restrictions</h3>
        <p className="mb-3">
          You have the right to request a restriction or limitation on the health information we use or disclose about you for treatment, payment, or healthcare operations. We are not required to agree to your request except in certain limited circumstances.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.5 Right to Request Confidential Communications</h3>
        <p className="mb-3">
          You have the right to request that we communicate with you about health matters in a certain way or at a certain location. For example, you may ask that we contact you only at work or by mail.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.6 Right to a Paper Copy of This Notice</h3>
        <p className="mb-3">
          You have the right to receive a paper copy of this Notice at any time, even if you have agreed to receive it electronically. You may ask us to give you a copy of this Notice at any time.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.7 Right to Notification of a Breach</h3>
        <p className="mb-3">
          You have the right to be notified in the event of a breach of your unsecured protected health information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">5. How to Exercise Your Rights</h2>
        <p className="mb-3">
          To exercise any of your rights described in this Notice, you must submit a written request to our Privacy Officer at:
        </p>
        <div className="pl-4 mb-3">
          <p>Starkwell Privacy Officer</p>
          <p>Email: privacy@starkwell.com</p>
          <p>Address: Salt Lake City, Utah</p>
        </div>
        <p>
          We're a small team without a case-management system yet, but a real person reads every message and we'll respond as quickly as we can.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">6. Complaints</h2>
        <p className="mb-3">
          If you believe your privacy rights have been violated, you may file a complaint with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Starkwell Privacy Officer (contact information above)</li>
          <li>The Secretary of the U.S. Department of Health and Human Services</li>
        </ul>
        <p className="mb-3">
          You will not be penalized or retaliated against for filing a complaint.
        </p>
        <p>
          To file a complaint with the U.S. Department of Health and Human Services:
        </p>
        <div className="pl-4 mb-3">
          <p>Office for Civil Rights</p>
          <p>U.S. Department of Health and Human Services</p>
          <p>200 Independence Avenue, S.W.</p>
          <p>Washington, D.C. 20201</p>
          <p>Phone: 1-877-696-6775</p>
          <p>Website: www.hhs.gov/ocr/privacy/hipaa/complaints</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">7. Our Responsibilities</h2>
        <p className="mb-3">
          We are required by law to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Maintain the privacy and security of your protected health information</li>
          <li>Provide you with this Notice of our legal duties and privacy practices</li>
          <li>Follow the terms of the Notice currently in effect</li>
          <li>Notify you if we are unable to agree to a requested restriction</li>
          <li>Notify you following a breach of unsecured protected health information</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">8. Changes to This Notice</h2>
        <p className="mb-3">
          We reserve the right to change this Notice and to make the revised or changed Notice effective for health information we already have about you as well as any information we receive in the future.
        </p>
        <p className="mb-3">
          We will post a copy of the current Notice on our website and in our facilities. The Notice will contain the effective date on the first page.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">9. Security Measures</h2>
        <p className="mb-3">
          Here's what's actually true today, and what's still ahead:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Providers can only see their own claimed listings and the appointment requests sent to them</li>
          <li>We never sell your data, and never share it without consent</li>
          <li><em>Not yet in place:</em> encryption in transit (HTTPS), encryption at rest, formal workforce training, regular third-party security audits, and a written incident-response/breach-notification procedure</li>
        </ul>
        <p>
          We're building toward all of the above rather than claiming it's finished.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">10. Electronic Health Records</h2>
        <p className="mb-3">
          Starkwell does not operate an electronic health record system. We don't store diagnoses,
          treatment history, or clinical notes — today this is a price-comparison directory, plus
          an appointment-request inbox that passes along only what a patient chooses to send.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">11. AI and Machine Learning</h2>
        <p className="mb-3">
          Starkwell plans to use AI to help match a plain-language description of a symptom or
          need to the right real, priced service in our catalog. This feature isn't live yet. When
          it launches, it will be built so the AI can only return real catalog entries — never
          invent one — and any vendor used for it will need a signed business-associate agreement
          in place first.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">12. Data Retention and Disposal</h2>
        <p className="mb-3">
          We retain your health information for as long as necessary to provide services to you and as required by law. When your health information is no longer needed, we dispose of it securely using methods that prevent unauthorized access.
        </p>
        <p>
          You may request deletion of your health information, subject to legal and regulatory retention requirements.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">13. Contact Information</h2>
        <p className="mb-3">
          If you have questions about this Notice or need more information about our privacy practices, please contact:
        </p>
        <div className="pl-4">
          <p><strong>Starkwell Privacy Officer</strong></p>
          <p>Email: privacy@starkwell.com</p>
          <p>Address: Salt Lake City, Utah</p>
        </div>
      </section>

      <section className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm">
          <strong>Acknowledgment:</strong> By using Starkwell's services, you acknowledge that you have received, read, and understood this Notice of Privacy Practices and agree to the uses and disclosures of your protected health information as described herein.
        </p>
      </section>
    </div>
  );
}
