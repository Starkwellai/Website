import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, Lock } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-12 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

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
              <p className="text-sm text-gray-600 mt-4">Last Updated: March 23, 2026</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-6">
                <div className="space-y-6 text-gray-700">
                  {/* Introduction */}
                  <section>
                    <p className="mb-3">
                      At HealthCare Portal ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform.
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
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Personal Information You Provide</h3>
                        <p className="mb-2">We collect information that you voluntarily provide when using our Service:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>Account Information:</strong> Name, email address, phone number, date of birth, and password</li>
                          <li><strong>Profile Information:</strong> Address, emergency contact information, preferred language</li>
                          <li><strong>Health Information:</strong> Insurance details, medical history, prescriptions, health documents</li>
                          <li><strong>Communication Data:</strong> Messages, feedback, support inquiries, and survey responses</li>
                          <li><strong>Payment Information:</strong> Billing address and payment method details (processed by secure third-party payment processors)</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Automatically Collected Information</h3>
                        <p className="mb-2">When you access our Service, we automatically collect certain information:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device identifiers</li>
                          <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on pages, click patterns, navigation paths</li>
                          <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                          <li><strong>Cookies and Tracking:</strong> Preferences, session data, and analytics information</li>
                          <li><strong>Log Data:</strong> Server logs, error reports, and system activity</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Information from Third Parties</h3>
                        <p className="mb-2">We may receive information about you from:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Healthcare providers and facilities (with your authorization)</li>
                          <li>Insurance companies and payers</li>
                          <li>Pharmacy networks</li>
                          <li>Laboratory and diagnostic services</li>
                          <li>Business partners and service providers</li>
                        </ul>
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
                          <li>• Create and manage your account</li>
                          <li>• Process and fulfill your requests</li>
                          <li>• Provide customer support and respond to inquiries</li>
                          <li>• Improve, personalize, and enhance user experience</li>
                          <li>• Develop new features and functionality</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Healthcare Coordination</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Facilitate communication with healthcare providers</li>
                          <li>• Coordinate care and manage appointments</li>
                          <li>• Process insurance claims and benefits</li>
                          <li>• Send health reminders and notifications</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Communication</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Send transactional emails and notifications</li>
                          <li>• Provide service updates and announcements</li>
                          <li>• Send newsletters and health information (with consent)</li>
                          <li>• Request feedback and conduct surveys</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Security and Compliance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Monitor and prevent fraud, abuse, and security threats</li>
                          <li>• Enforce our Terms and Conditions</li>
                          <li>• Comply with legal obligations and regulatory requirements</li>
                          <li>• Protect the rights and safety of our users</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Analytics and Research</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Analyze usage patterns and trends</li>
                          <li>• Conduct research to improve healthcare outcomes (de-identified data only)</li>
                          <li>• Generate aggregate statistics and reports</li>
                          <li>• Perform quality assurance and testing</li>
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
                          We share your information when you explicitly authorize us to do so, such as sharing health records with your healthcare providers or family members.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Service Providers</h4>
                        <p className="text-sm mb-2">
                          We engage trusted third-party service providers who perform services on our behalf:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Cloud hosting and storage providers</li>
                          <li>Payment processors</li>
                          <li>Email and communication services</li>
                          <li>Analytics and monitoring tools</li>
                          <li>Customer support platforms</li>
                          <li>Security and fraud prevention services</li>
                        </ul>
                        <p className="text-sm mt-2">
                          These providers are bound by confidentiality agreements and are only permitted to use your information as necessary to provide services to us.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Healthcare Partners</h4>
                        <p className="text-sm">
                          We may share information with healthcare providers, insurance companies, pharmacies, and laboratories as necessary to facilitate your care and process claims, in accordance with HIPAA regulations.
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
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">4. Cookies and Tracking Technologies</h2>
                    <p className="mb-3">
                      We use cookies and similar tracking technologies to enhance your experience and collect usage information.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Types of Cookies We Use:</h4>
                        <ul className="text-sm space-y-2">
                          <li>
                            <strong>Essential Cookies:</strong> Required for the Service to function properly (authentication, security)
                          </li>
                          <li>
                            <strong>Functional Cookies:</strong> Remember your preferences and settings
                          </li>
                          <li>
                            <strong>Analytics Cookies:</strong> Help us understand how users interact with our Service
                          </li>
                          <li>
                            <strong>Performance Cookies:</strong> Monitor and improve Service performance
                          </li>
                        </ul>
                      </div>

                      <p className="text-sm">
                        You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our Service.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">5. Data Security</h2>
                    <p className="mb-3">
                      We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction:
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Encryption</h4>
                        <ul className="text-sm space-y-1">
                          <li>• TLS/SSL for data in transit</li>
                          <li>• AES-256 encryption at rest</li>
                          <li>• Encrypted database storage</li>
                          <li>• End-to-end encryption for sensitive data</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Access Controls</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Multi-factor authentication</li>
                          <li>• Role-based access restrictions</li>
                          <li>• Regular access audits</li>
                          <li>• Automatic session timeouts</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Infrastructure</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Secure cloud hosting</li>
                          <li>• Regular security updates</li>
                          <li>• Firewall protection</li>
                          <li>• Intrusion detection systems</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Monitoring</h4>
                        <ul className="text-sm space-y-1">
                          <li>• 24/7 security monitoring</li>
                          <li>• Regular vulnerability scans</li>
                          <li>• Penetration testing</li>
                          <li>• Incident response procedures</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-sm mt-3 text-gray-600">
                      While we strive to protect your information, no method of transmission or storage is 100% secure. We cannot guarantee absolute security but continuously work to improve our safeguards.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">6. Data Retention</h2>
                    <p className="mb-3">
                      We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>
                        <strong>Account Information:</strong> Retained while your account is active and for a reasonable period thereafter
                      </li>
                      <li>
                        <strong>Health Records:</strong> Retained in accordance with HIPAA and state medical record retention laws (typically 6-10 years)
                      </li>
                      <li>
                        <strong>Transaction Records:</strong> Retained for accounting and legal compliance purposes (typically 7 years)
                      </li>
                      <li>
                        <strong>Analytics Data:</strong> Retained in aggregated form indefinitely
                      </li>
                      <li>
                        <strong>Communications:</strong> Retained for customer service and legal purposes
                      </li>
                    </ul>
                    <p className="text-sm mt-3">
                      When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law or for legitimate business purposes.
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
                      To exercise these rights, please contact us at privacy@healthcareportal.com. We will respond to your request within 30 days.
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
                      <p className="font-medium mb-3">HealthCare Portal Privacy Team</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Email:</strong> privacy@healthcareportal.com</p>
                        <p><strong>Phone:</strong> 1-800-PRIVACY-1 (1-800-774-8229)</p>
                        <p><strong>Mail:</strong> Privacy Officer, HealthCare Portal, 123 Medical Center Drive, Suite 100</p>
                        <p className="mt-3"><strong>Data Protection Officer:</strong> dpo@healthcareportal.com</p>
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