'use client';

const FOLD_CHAR_LIMIT = 210;

export function LinkedInPreview({ body }: { body: string }) {
  const isLong = body.length > FOLD_CHAR_LIMIT;
  const visibleText = isLong ? body.slice(0, FOLD_CHAR_LIMIT) : body;

  return (
    <div className="card border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
          JA
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Joseph Adipietro</p>
          <p className="text-xs text-gray-500">SVP Corporate Strategy &amp; Transformation at PepsiCo</p>
          <p className="text-xs text-gray-400">Just now &middot; 🌐</p>
        </div>
      </div>

      <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {visibleText}
        {isLong && (
          <span className="text-gray-400">...
            <span className="text-brand-600 font-medium ml-1">see more</span>
          </span>
        )}
      </div>

      {/* Fold indicator */}
      {body.length > 0 && (
        <div className="mt-3 pt-2 border-t border-dashed border-gray-200 text-center">
          <p className="text-[10px] text-gray-400">
            {isLong ? (
              <>⚠️ &ldquo;See more&rdquo; fold at {FOLD_CHAR_LIMIT} chars — first {FOLD_CHAR_LIMIT} chars shown above</>
            ) : (
              <>✅ Entire post visible without &ldquo;See more&rdquo; ({body.length}/{FOLD_CHAR_LIMIT} chars)</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
