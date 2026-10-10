import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, Lock } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <SiteHeader />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Lock className="size-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">Privacy Policy</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    How we collect, use, and protect your information
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Last Updated: October 11, 2026</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-6">
                <div className="space-y-6 text-gray-700">
                  {/* Introduction */}
                  <section>
                    <p className="mb-3">
                      At Starkwell ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform.
                    </p>
                    <p className="mb-3">
                      Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
                    </p>
                    <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
                      <p className="font-medium text-blue-900">
                        Note: This Privacy Policy is separate from and complements our HIPAA Privacy Notice, which specifically addresses Protected Health Information (PHI). Please review both documents.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">1. Information We Collect</h2>
                    <p className="mb-3 text-sm">
                      Most of what Starkwell shows is public information: prices that insurers publish, public provider registries, and public drug-price lists. You can use the price search without an account and without giving us your name.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">What You Give Us</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>Searches:</strong> The words you type into search. If a search finds nothing and you choose to describe your situation instead, the description you type</li>
                          <li><strong>Clinic accounts:</strong> Practice name, contact name, email address, phone number, NPI number, specialty, city, state, and any message you send with your request. Your password is stored only as a salted, one-way hash, never in readable form</li>
                          <li><strong>Clinic listing details:</strong> The phone number, website, hours, insurance note, and review replies a clinic chooses to publish</li>
                          <li><strong>Reviews:</strong> The rating, comment, and optional name you submit</li>
                          <li><strong>Messages to us:</strong> Anything you send when you contact us</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">What We Record Automatically</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>Page visits:</strong> The date and time and the page address (for example, "/prices"), so we can count how many times the site is opened. Visits by automated crawlers are left out</li>
                          <li><strong>Search records:</strong> The date and time, the words searched, and how many results came back, so we can see what people look for and which searches fail. These records are not linked to your name, account, or device</li>
                        </ul>
                        <p className="text-sm mt-2">
                          We do <strong>not</strong> record IP addresses, device or browser details, precise location, or advertising identifiers in our own records. Our server sees your IP address while it handles each request, and briefly holds it in memory to limit abuse (for example, to stop one source from sending thousands of requests), but does not save it. Our hosting provider may keep its own network-level records under its own policies.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Public Data Sources</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Insurers' published negotiated-rate files</li>
                          <li>The federal NPI provider registry and the NUCC taxonomy</li>
                          <li>Federal and public drug-price lists</li>
                          <li>Hospital price files and Medicare reference data</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Not Collected Today</h3>
                        <p className="text-sm">
                          We do not currently collect payment or billing information, health insurance member details, medical history, patient accounts, or appointment details, and appointment requests are turned off. These are planned. Before any of them launch, we will update this policy and our HIPAA Privacy Notice and tell you what we collect and why. Please do not type your name, medical history, or other personal details into the search box.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">2. How We Use Your Information</h2>
                    <p className="mb-3">We use the information we collect for the following purposes:</p>

                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Provide and Improve Our Service</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Run the price search and show you the results</li>
                          <li>• Set up, verify, and run clinic accounts, claims, and reviews</li>
                          <li>• Respond to your questions and requests</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Understand Usage</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Count visits to the site</li>
                          <li>• See what people search for, and improve results for searches that find nothing</li>
                          <li>• Generate aggregate statistics and reports</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Match a Description to a Procedure</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Only when you choose "describe it instead" after a search finds nothing, we use an AI service to match your description to a procedure in our list (see Section 3)</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Security and Compliance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Monitor and prevent fraud, abuse, and security threats</li>
                          <li>• Enforce our Terms and Conditions</li>
                          <li>• Comply with legal obligations and regulatory requirements</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">3. How We Share Your Information</h2>
                    <p className="mb-3">
                      We respect your privacy and do not sell your personal information. We may share your information in the following circumstances:
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">With Your Consent</h4>
                        <p className="text-sm">
                          If we turn on appointment requests, we will share only what you submit with the clinic you choose to contact. Appointment requests are currently turned off.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Service Providers</h4>
                        <p className="text-sm mb-2">
                          We share information with the companies that help us run the site:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>Cloud hosting provider:</strong> Our servers run on DigitalOcean, which stores the data described in this policy on our behalf</li>
                          <li><strong>AI service provider:</strong> Only when a search finds nothing and you choose "describe it instead," the text you typed is sent to an AI service operated by Anthropic so it can match your description to a procedure in our list. We send that text and nothing else about you, and only matches from our own list are shown back to you. Anthropic handles the text under its own terms and privacy policy</li>
                        </ul>
                        <p className="text-sm mt-2">
                          We do not use advertising networks or analytics vendors. If we add service providers such as payment processors or customer support tools, we will list them here first.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Legal Requirements</h4>
                        <p className="text-sm mb-2">We may disclose your information when required by law:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>To comply with legal processes, court orders, or government requests</li>
                          <li>To protect our rights, property, or safety</li>
                          <li>To prevent fraud or security threats</li>
                          <li>In response to law enforcement requests</li>
                          <li>To comply with public health and safety requirements</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Business Transfers</h4>
                        <p className="text-sm">
                          In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Aggregated Data</h4>
                        <p className="text-sm">
                          We may share de-identified, aggregated, or anonymized data that cannot reasonably be used to identify you for research, analytics, or marketing purposes.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">4. Cookies and Information Stored in Your Browser</h2>
                    <p className="mb-3">
                      We do not use advertising or analytics cookies, and we do not use third-party trackers. The site stores a few items in your own browser, only to make features work:
                    </p>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <ul className="text-sm space-y-2">
                          <li>
                            <strong>Saved items:</strong> The procedures and facilities you save are kept in your browser on your device, not on our servers
                          </li>
                          <li>
                            <strong>Clinic sign-in:</strong> If you log in to a clinic account, a sign-in token is kept in your browser until you log out or it expires
                          </li>
                          <li>
                            <strong>Interface setting:</strong> A small cookie may remember whether a side menu is open
                          </li>
                        </ul>
                      </div>

                      <p className="text-sm">
                        You can clear this information at any time in your browser settings. Doing so will remove your saved items and sign you out.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">5. Data Security</h2>
                    <p className="mb-3">
                      Starkwell is a small, early-stage product. Here's what's actually true today,
                      not an enterprise checklist we haven't earned yet:
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">In place today</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Providers can only see their own claimed listings and requests</li>
                          <li>• We never sell your data, and never share it without consent</li>
                          <li>• Practice passwords are stored only as salted hashes, never in plain text</li>
                          <li>• HTTPS (encryption in transit between your browser and this site)</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Not yet in place</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Encryption at rest</li>
                          <li>• Multi-factor authentication</li>
                          <li>• Third-party security audits and monitoring</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-sm mt-3 text-gray-600">
                      We're building toward the items above rather than claiming they're finished.
                      No method of transmission or storage is ever 100% secure, even once they're
                      in place — we cannot guarantee absolute security, only that we'll tell you
                      honestly what's actually done.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">6. Data Retention</h2>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>
                        <strong>Page-visit and search records:</strong> Kept for 12 months, then deleted automatically
                      </li>
                      <li>
                        <strong>Clinic accounts and listings:</strong> Kept while the account is active. You can ask us to delete an account and its listings at any time
                      </li>
                      <li>
                        <strong>Reviews:</strong> Kept until removed under our review rules or at the author's request
                      </li>
                      <li>
                        <strong>Backups:</strong> Nightly backups are kept for 14 days and then overwritten, so deleted information can remain in a backup for up to 14 days
                      </li>
                    </ul>
                    <p className="text-sm mt-3">
                      When we no longer need other information, we will securely delete or anonymize it.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">7. Your Privacy Rights</h2>
                    <p className="mb-3">
                      Depending on your location, you may have the following rights regarding your personal information:
                    </p>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Access and Portability</h4>
                        <p className="text-sm">
                          Request a copy of your personal information in a structured, commonly used, and machine-readable format
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Correction</h4>
                        <p className="text-sm">
                          Request correction of inaccurate or incomplete personal information
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Deletion</h4>
                        <p className="text-sm">
                          Request deletion of your personal information, subject to legal and contractual obligations
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Objection and Restriction</h4>
                        <p className="text-sm">
                          Object to or request restriction of certain processing activities
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Opt-Out</h4>
                        <p className="text-sm">
                          Opt out of marketing communications and certain data sharing practices
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Non-Discrimination</h4>
                        <p className="text-sm">
                          Exercise your privacy rights without discrimination
                        </p>
                      </div>
                    </div>

                    <p className="text-sm mt-4">
                      To exercise these rights, please contact us at privacy@starkwell.com. We will respond to your request within 30 days.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">8. Children's Privacy</h2>
                    <p className="mb-3">
                      Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                    </p>
                    <p>
                      For users between 13 and 18 years of age, we require parental or guardian consent before creating an account.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">9. International Data Transfers</h2>
                    <p className="mb-3">
                      Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your jurisdiction.
                    </p>
                    <p>
                      When we transfer your information internationally, we implement appropriate safeguards such as Standard Contractual Clauses and ensure that your information receives an adequate level of protection.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">10. Third-Party Links</h2>
                    <p className="mb-3">
                      Our Service may contain links to third-party websites and services. This Privacy Policy does not apply to those third-party sites. We are not responsible for the privacy practices of other websites.
                    </p>
                    <p>
                      We encourage you to review the privacy policies of any third-party sites you visit.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">11. State-Specific Privacy Rights</h2>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">California Residents (CCPA/CPRA)</h4>
                        <p className="text-sm mb-2">If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Right to know what personal information is collected, used, and shared</li>
                          <li>Right to delete personal information</li>
                          <li>Right to opt-out of the sale of personal information (we do not sell your information)</li>
                          <li>Right to non-discrimination for exercising your privacy rights</li>
                          <li>Right to limit use of sensitive personal information</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Other State Laws</h4>
                        <p className="text-sm">
                          We comply with privacy laws in Virginia, Colorado, Connecticut, Utah, and other states with comprehensive privacy legislation.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">12. Changes to This Privacy Policy</h2>
                    <p className="mb-3">
                      We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-3">
                      <li>Posting the updated policy on our website</li>
                      <li>Updating the "Last Updated" date</li>
                      <li>Sending an email notification for significant changes</li>
                      <li>Displaying a prominent notice on our Service</li>
                    </ul>
                    <p>
                      Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">13. Contact Us</h2>
                    <p className="mb-3">
                      If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-medium mb-3">Starkwell Privacy Team</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Email:</strong> privacy@starkwell.com</p>
                        <p><strong>Address:</strong> Salt Lake City, Utah</p>
                      </div>
                    </div>
                  </section>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mt-8">
                    <p className="text-sm text-gray-700">
                      <strong>Related Documents:</strong> For information specific to Protected Health Information, please review our{" "}
                      <a href="/hipaa-privacy" className="text-blue-600 hover:underline">HIPAA Privacy Notice</a>. 
                      For terms of service usage, see our{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a>.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}