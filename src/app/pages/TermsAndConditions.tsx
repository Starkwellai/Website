import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function TermsAndConditions() {
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
              <CardTitle className="text-2xl text-blue-900">Terms and Conditions</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Last Updated: October 7, 2026</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-6">
                <div className="space-y-6 text-gray-700">
                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">1. Acceptance of Terms</h2>
                    <p className="mb-3">
                      By accessing and using Starkwell ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    <p>
                      These Terms and Conditions constitute a legally binding agreement between you and Starkwell regarding your use of the Service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">2. Use License</h2>
                    <p className="mb-3">
                      Permission is granted to access and use Starkwell for personal, non-commercial purposes, such as researching healthcare prices. This license shall automatically terminate if you violate any of these restrictions.
                    </p>
                    <p className="font-medium mb-2">You may not:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose</li>
                      <li>Attempt to decompile or reverse engineer any software</li>
                      <li>Remove any copyright or proprietary notations</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">3. User Account and Security</h2>
                    <p className="mb-3">
                      You do not need an account to search prices. Today, accounts exist only for practices that register to claim a listing; patient accounts are not available yet. If you have an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-3">
                      <li>Provide accurate, current, and complete information during registration</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Maintain the security of your password and account</li>
                      <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                    <p>
                      We reserve the right to terminate accounts, refuse service, or remove or edit content at our sole discretion.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">4. Healthcare Information Disclaimer</h2>
                    <p className="mb-3">
                      Starkwell is a price-comparison tool. The prices it shows come from rate files that insurers and hospitals publish; they are not quotes, and your actual cost depends on your plan and the care you receive. Starkwell reviews a practice's claim before its listing appears, but the details on a claimed listing are written by the practice and are not checked or endorsed by Starkwell. Starkwell is not a substitute for professional medical advice, diagnosis, or treatment, and it does not book appointments, sell insurance, or process payments.
                    </p>
                    <p className="mb-3 font-medium text-blue-900">
                      Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this Service.
                    </p>
                    <p>
                      In case of a medical emergency, call your doctor or 911 immediately. Starkwell does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">5. Protected Health Information (PHI)</h2>
                    <p className="mb-3">
                      We understand the sensitive nature of your health information. By using this Service, you authorize us to collect, use, and disclose your Protected Health Information as described in our HIPAA Privacy Notice.
                    </p>
                    <p>
                      We're building toward full technical, administrative, and physical safeguards for PHI in accordance with HIPAA regulations — see our HIPAA Privacy Notice for exactly what's true today.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">6. Data Security and Storage</h2>
                    <p className="mb-3">
                      Here's what's actually true today, not an aspirational list:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-3">
                      <li>Provider accounts can only see their own claimed listings and requests</li>
                      <li>We never sell your data, and never share it without consent</li>
                      <li>Connections between your browser and this site are encrypted with HTTPS</li>
                    </ul>
                    <p className="mb-3">
                      <em>Not yet in place:</em> encryption at rest,
                      regular security audits, and formal backup/disaster-recovery procedures.
                      However, no method of transmission over the Internet or electronic storage is
                      ever 100% secure, even once those safeguards are added — we cannot guarantee
                      absolute security.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">7. User Conduct</h2>
                    <p className="mb-3">You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Upload, post, or transmit any content that is unlawful, harmful, or objectionable</li>
                      <li>Impersonate any person or entity</li>
                      <li>Interfere with or disrupt the Service or servers</li>
                      <li>Violate any applicable local, state, national, or international law</li>
                      <li>Use the Service for any fraudulent or illegal purpose</li>
                      <li>Harvest or collect information about other users</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">8. Third-Party Services</h2>
                    <p className="mb-3">
                      Our Service may contain links to third-party websites or services that are not owned or controlled by Starkwell. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                    </p>
                    <p>
                      You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by your use of any third-party content, goods, or services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">9. Intellectual Property</h2>
                    <p className="mb-3">
                      The Service and its original content, features, and functionality are and will remain the exclusive property of Starkwell and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>
                    <p>
                      You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content solely for the purpose of providing the Service to you.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">10. Termination</h2>
                    <p className="mb-3">
                      We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
                    </p>
                    <p className="mb-3">
                      Upon termination, your right to use the Service will cease immediately. You may delete your account at any time by contacting us. Upon account deletion, we will delete your PHI in accordance with applicable law and our data retention policies.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">11. Limitation of Liability</h2>
                    <p className="mb-3">
                      To the maximum extent permitted by applicable law, Starkwell shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or goodwill.
                    </p>
                    <p>
                      Our total liability for any claims under these Terms shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">12. Changes to Terms</h2>
                    <p className="mb-3">
                      We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    </p>
                    <p>
                      Your continued use of the Service after any changes constitutes acceptance of those changes.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">13. Governing Law</h2>
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the appropriate federal or state courts.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">14. Contact Information</h2>
                    <p className="mb-2">
                      If you have any questions about these Terms, please contact us at:
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-medium">Starkwell</p>
                      <p>Email: legal@starkwell.com</p>
                      <p>Address: Salt Lake City, Utah</p>
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