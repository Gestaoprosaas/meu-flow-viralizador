import re

with open("src/components/ScreenProdutos.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """            {/* STEP 2: MULTI-MODE DELEGATOR */}
            {wizardStep === 2 && ("""

replacement = """            {/* SKIPPING MESSAGE OVERLAY */}
            {skippingMessage && (
              <div className="absolute inset-0 z-50 bg-[#0B0B11]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
                <div className="bg-[#1E1E2E] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
                  {skippingMessage}
                </div>
              </div>
            )}

            {/* STEP 2: MULTI-MODE DELEGATOR */}
            {wizardStep === 2 && ("""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/ScreenProdutos.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
