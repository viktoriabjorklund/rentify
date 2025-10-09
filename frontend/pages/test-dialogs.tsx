import React from 'react';
import Head from 'next/head';
import { DialogExample } from '../components/DialogExample';

export default function TestDialogsPage() {
  return (
    <>
      <Head>
        <title>Dialog Testing - Rentify</title>
        <meta name="description" content="Test page for dialog components" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            🎭 Dialog Components Visual Testing
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <DialogExample />
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">🎯 Visual Testing Guide</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>1. 🔐 Login Dialog:</strong> Click "Open Login Dialog" to see authentication prompt</p>
                <p><strong>2. 📞 Contact Dialog:</strong> Click "Open Contact Dialog" to see owner contact options</p>
                <p><strong>3. 🗑️ Delete Dialog:</strong> Click "Open Delete Dialog" to see deletion confirmation</p>
                <p><strong>4. ❌ Cancel Dialog:</strong> Click "Open Cancel Dialog" to see rental cancellation</p>
                <p><strong>5. ⌨️ Keyboard:</strong> Press ESC to close any dialog</p>
                <p><strong>6. 🖱️ Backdrop:</strong> Click outside dialogs to close them</p>
                <p><strong>7. 📱 Mobile:</strong> Resize browser to test mobile responsiveness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
