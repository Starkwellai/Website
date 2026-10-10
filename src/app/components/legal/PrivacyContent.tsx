export function PrivacyContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">1. Introduction</h2>
        <p className="mb-3">
          Starkwell ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare marketplace and navigation platform.
        </p>
        <p className="mb-3">
          This Privacy Policy applies to all information collected through our Service and any related services, sales, marketing, or events (collectively, the "Services").
        </p>
        <p>
          We have written this policy to describe what the site does today. Where a feature is not live yet, we say so, and we will update this policy before that feature launches.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">2. Information We Collect</h2>
        <p className="mb-3">
          Most of what Starkwell shows is public information: prices that insurers publish, public provider registries, and public drug-price lists. You can use the price search without an account and without giving us your name.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.1 What you give us</h3>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li><strong>Searches:</strong> the words you type into search. If a search finds nothing and you choose to describe your situation instead, the description you type.</li>
          <li><strong>Clinic accounts:</strong> practice name, contact name, email address, phone number, NPI number, specialty, city, state, and any message you send with your request. Your password is stored only as a salted, one-way hash, never in readable form.</li>
          <li><strong>Clinic listing details:</strong> the phone number, website, hours, insurance note, and review replies a clinic chooses to publish.</li>
          <li><strong>Reviews:</strong> the rating, comment, and optional name you submit.</li>
          <li><strong>Messages to us:</strong> anything you send when you contact us.</li>
        </ul>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.2 What we record automatically</h3>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li><strong>Page visits:</strong> the date and time and the page address (for example, "/prices"), so we can count how many times the site is opened. Visits by automated crawlers are left out.</li>
          <li><strong>Search records:</strong> the date and time, the words searched, and how many results came back, so we can see what people look for and which searches fail. These records are not linked to your name, account, or device.</li>
        </ul>
        <p className="mb-3">
          We do <strong>not</strong> record IP addresses, device or browser details, precise location, or advertising identifiers in our own records. Our server sees your IP address while it handles each request, and briefly holds it in memory to limit abuse (for example, to stop one source from sending thousands of requests), but does not save it. Our hosting provider may keep its own network-level records under its own policies.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.3 Public data sources</h3>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Insurers' published negotiated-rate files</li>
          <li>The federal NPI provider registry and the NUCC taxonomy</li>
          <li>Federal and public drug-price lists</li>
          <li>Hospital price files and Medicare reference data</li>
        </ul>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">2.4 Not collected today</h3>
        <p className="mb-3">
          We do not currently collect payment or billing information, health insurance member details, medical history, patient accounts, or appointment details, and appointment requests are turned off. These are planned. Before any of them launch, we will update this policy and our HIPAA Notice and tell you what we collect and why. Please do not type your name, medical history, or other personal details into the search box.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">3. How We Use Your Information</h2>
        <p className="mb-3">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Provide, maintain, and improve the price search and the rest of the Services</li>
          <li>Understand what people search for, and improve results for searches that find nothing</li>
          <li>Count visits to the site</li>
          <li>Match a plain-language description to our list of procedures, when you choose to use that option (see 4.2)</li>
          <li>Set up, verify, and run clinic accounts, claims, and reviews</li>
          <li>Respond to your comments, questions, and requests, and send you security notices</li>
          <li>Detect, prevent, and address technical issues, abuse, and fraud</li>
          <li>Comply with legal obligations and enforce our Terms and Conditions</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">4. How We Share Your Information</h2>
        <p className="mb-3">
          We may share your information in the following circumstances:
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.1 With Your Consent</h3>
        <p className="mb-3">
          If we turn on appointment requests, we will share only what you submit with the clinic you choose to contact. Appointment requests are currently turned off.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.2 Service Providers</h3>
        <p className="mb-3">
          We share information with the companies that help us run the site:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li><strong>Cloud hosting provider:</strong> our servers run on DigitalOcean, which stores the data described in this policy on our behalf.</li>
          <li><strong>AI service provider:</strong> only when a search finds nothing and you choose "describe it instead," the text you typed is sent to an AI service operated by Anthropic so it can match your description to a procedure in our list. We send that text and nothing else about you, and only the matches from our own list are shown back to you. Anthropic handles the text under its own terms and privacy policy.</li>
        </ul>
        <p className="mb-3">
          We do not use advertising networks or analytics vendors. If we add service providers such as payment processors or customer support tools, we will list them here first.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.3 Legal Requirements</h3>
        <p className="mb-3">
          We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.4 Business Transfers</h3>
        <p className="mb-3">
          In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business, your information may be transferred to the acquiring entity.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">4.5 Aggregated or De-identified Data</h3>
        <p className="mb-3">
          We may share aggregated or de-identified information that cannot reasonably be used to identify you.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">5. Data Security</h2>
        <p className="mb-3">
          Here's what's actually true today, not an aspirational list:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Provider accounts can only see their own claimed listings and the requests sent to them</li>
          <li>We never sell your data, and never share it without consent</li>
          <li>Connections between your browser and this site are encrypted with HTTPS</li>
        </ul>
        <p className="mb-3">
          <em>Not yet in place:</em> encryption at rest, regular
          third-party security audits, and formal HIPAA-compliant infrastructure — these are real
          work we're building toward, not something already true. However, no method of
          transmission over the Internet or electronic storage is ever 100% secure, even once
          those safeguards are added — we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">6. Your Privacy Rights</h2>
        <p className="mb-3">
          Depending on your location, you may have certain rights regarding your personal information:
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">6.1 Access and Portability</h3>
        <p className="mb-3">
          You have the right to request access to the personal information we hold about you and to receive a copy of that information in a portable format.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">6.2 Correction</h3>
        <p className="mb-3">
          You have the right to request that we correct any inaccurate personal information about you.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">6.3 Deletion</h3>
        <p className="mb-3">
          You have the right to request that we delete your personal information, subject to certain exceptions (e.g., when we need to retain information to comply with legal obligations).
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">6.4 Opt-Out</h3>
        <p className="mb-3">
          You may opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications or by contacting us directly.
        </p>

        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">6.5 Do Not Sell My Personal Information</h3>
        <p className="mb-3">
          We do not sell your personal information to third parties. If our practices change, we will update this Privacy Policy and provide you with the ability to opt out.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">7. Cookies and Information Stored in Your Browser</h2>
        <p className="mb-3">
          We do not use advertising or analytics cookies, and we do not use third-party trackers. The site stores a few items in your own browser, only to make features work:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3 mt-2">
          <li><strong>Saved items:</strong> the procedures and facilities you save are kept in your browser on your device, not on our servers.</li>
          <li><strong>Clinic sign-in:</strong> if you log in to a clinic account, a sign-in token is kept in your browser until you log out or it expires.</li>
          <li><strong>Interface setting:</strong> a small cookie may remember whether a side menu is open.</li>
        </ul>
        <p>
          You can clear this information at any time in your browser settings. Doing so will remove your saved items and sign you out.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">8. Third-Party Links and Services</h2>
        <p>
          Our Service may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">9. Children's Privacy</h2>
        <p>
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to delete such information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">10. California Privacy Rights</h2>
        <p className="mb-3">
          If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>The right to know what personal information we collect, use, and disclose</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to opt out of the sale of your personal information (we do not sell personal information)</li>
          <li>The right to non-discrimination for exercising your privacy rights</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">11. International Data Transfers</h2>
        <p>
          Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you consent to this transfer.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">12. Data Retention</h2>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li><strong>Page-visit and search records:</strong> kept for 12 months, then deleted automatically.</li>
          <li><strong>Clinic accounts and listings:</strong> kept while the account is active. You can ask us to delete an account and its listings at any time.</li>
          <li><strong>Reviews:</strong> kept until removed under our review rules or at the author's request.</li>
          <li><strong>Backups:</strong> nightly backups are kept for 14 days and then overwritten, so deleted information can remain in a backup for up to 14 days.</li>
        </ul>
        <p>
          When we no longer need other information, we will securely delete or anonymize it.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">13. Changes to This Privacy Policy</h2>
        <p className="mb-3">
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        <p>
          Your continued use of the Service after any changes indicates your acceptance of the updated Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-3">14. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <div className="mt-2 pl-4">
          <p>Starkwell Privacy Department</p>
          <p>Email: privacy@starkwell.com</p>
          <p>Address: Salt Lake City, Utah</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </section>
    </div>
  );
}
