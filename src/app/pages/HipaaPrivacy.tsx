import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, Shield } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function HipaaPrivacy() {
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
                  <Shield className="size-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    HIPAA Privacy Notice
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Notice of Privacy Practices for Protected Health Information
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Effective Date: March 23, 2026</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-6">
                <div className="space-y-6 text-gray-700">
                  {/* Important Notice */}
                  <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
                    <p className="font-semibold text-blue-900 mb-2">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
                  </div>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Our Commitment to Your Privacy</h2>
                    <p className="mb-3">
                      Starkwell is committed to protecting the privacy of your Protected Health Information (PHI). This notice describes our privacy practices and your rights regarding your health information. We are required by law to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      <li>Maintain the privacy and security of your PHI</li>
                      <li>Provide you with this notice of our legal duties and privacy practices</li>
                      <li>Follow the terms of the notice currently in effect</li>
                      <li>Notify you following a breach of unsecured PHI</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">What is Protected Health Information (PHI)?</h2>
                    <p className="mb-3">
                      PHI is information about you, including demographic information, that may identify you and relates to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your past, present, or future physical or mental health condition</li>
                      <li>The provision of health care to you</li>
                      <li>The past, present, or future payment for your health care</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">How We May Use and Disclose Your PHI</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">1. Treatment</h3>
                        <p className="mb-2">
                          We may use and disclose your PHI to facilitate your medical treatment or services. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Coordinating or managing your health care</li>
                          <li>Consulting with other healthcare providers</li>
                          <li>Referring you to another healthcare provider</li>
                          <li>Providing your information to healthcare providers outside our organization</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">2. Payment</h3>
                        <p className="mb-2">
                          We may use and disclose your PHI to obtain payment for services provided to you, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Billing and collection activities</li>
                          <li>Determining eligibility for insurance benefits</li>
                          <li>Claims management and collection</li>
                          <li>Utilization review activities</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">3. Healthcare Operations</h3>
                        <p className="mb-2">
                          We may use and disclose your PHI for healthcare operations, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Quality assessment and improvement activities</li>
                          <li>Conducting training programs</li>
                          <li>Accreditation, certification, or licensing activities</li>
                          <li>Business planning and development</li>
                          <li>Business management and general administrative activities</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Uses and Disclosures That Require Your Authorization</h2>
                    <p className="mb-3">
                      Other than as stated above, we will not disclose your PHI without your written authorization. The following uses and disclosures require your specific authorization:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-3">
                      <li>Most uses and disclosures of psychotherapy notes</li>
                      <li>Uses and disclosures of PHI for marketing purposes</li>
                      <li>Disclosures that constitute a sale of PHI</li>
                      <li>Any other use or disclosure not described in this notice</li>
                    </ul>
                    <p className="font-medium text-blue-900">
                      You have the right to revoke your authorization in writing at any time, except to the extent that we have already taken action based on your authorization.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Your Rights Regarding Your PHI</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to Access</h3>
                        <p className="text-sm">
                          You have the right to inspect and obtain a copy of your PHI contained in a designated record set, subject to certain exceptions. We may charge a reasonable fee for copying and mailing costs.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to Amend</h3>
                        <p className="text-sm">
                          You have the right to request that we amend your PHI if you believe it is incorrect or incomplete. We may deny your request under certain circumstances.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to an Accounting of Disclosures</h3>
                        <p className="text-sm">
                          You have the right to request an accounting of certain disclosures of your PHI made by us during the six years prior to your request.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to Request Restrictions</h3>
                        <p className="text-sm">
                          You have the right to request restrictions on certain uses and disclosures of your PHI. We are not required to agree to your request except in limited circumstances.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to Request Confidential Communications</h3>
                        <p className="text-sm">
                          You have the right to request that we communicate with you about your PHI by alternative means or at alternative locations.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to a Paper Copy of This Notice</h3>
                        <p className="text-sm">
                          You have the right to obtain a paper copy of this notice, even if you have agreed to receive it electronically.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Right to Breach Notification</h3>
                        <p className="text-sm">
                          You have the right to be notified in the event of a breach of your unsecured PHI.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Security Safeguards</h2>
                    <p className="mb-3">
                      Starkwell is a small, early-stage product. Here's what's actually true today,
                      not a claim that every HIPAA safeguard is already built:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">In place today</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Providers only see their own claimed listings and requests</li>
                          <li>• We never sell your data, and never share it without consent</li>
                          <li>• Passwordless accounts — no password to leak, by design</li>
                          <li>• HTTPS (encryption in transit between your browser and this site)</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Not yet in place</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Encryption at rest</li>
                          <li>• Audit trails and monitoring</li>
                          <li>• Formal workforce training program</li>
                          <li>• Business associate agreements (none needed yet — no vendor handles PHI on our behalf today)</li>
                          <li>• A completed risk assessment and written incident-response plan</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm mt-3 text-gray-600">
                      We're building toward the safeguards above rather than claiming they're finished.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Changes to This Notice</h2>
                    <p className="mb-3">
                      We reserve the right to change this notice and make the new notice apply to PHI we already have as well as any information we receive in the future. We will post the current notice on our website and make copies available upon request.
                    </p>
                    <p>
                      The effective date of this notice is listed at the top of the first page.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Complaints</h2>
                    <p className="mb-3">
                      If you believe your privacy rights have been violated, you may file a complaint with us or with the Secretary of the Department of Health and Human Services. To file a complaint with us, contact our Privacy Officer at the address below.
                    </p>
                    <p className="font-medium text-blue-900 mb-3">
                      You will not be retaliated against for filing a complaint.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Contact Information</h2>
                    <p className="mb-3">
                      For questions about this notice or to exercise your rights:
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-medium">Privacy Officer - Starkwell</p>
                      <p className="mt-2">Email: privacy@starkwell.com</p>
                      <p>Address: Salt Lake City, Utah</p>
                      <p className="mt-3 text-sm">
                        Office of Civil Rights (OCR)<br />
                        U.S. Department of Health and Human Services<br />
                        200 Independence Avenue, S.W.<br />
                        Washington, D.C. 20201<br />
                        Phone: 1-877-696-6775<br />
                        Website: www.hhs.gov/ocr/privacy
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}