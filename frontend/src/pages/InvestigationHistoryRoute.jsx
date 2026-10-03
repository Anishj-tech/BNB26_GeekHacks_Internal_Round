import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { investigationService } from '../services/investigationService';

export const InvestigationHistoryRoute = () => {
  const { navigate } = useRouter();
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    investigationService
      .listInvestigations()
      .then((list) => {
        if (isMounted) {
          setInvestigations(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load history:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredInvestigations = investigations.filter((inv) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inv.id.toLowerCase().includes(query) ||
      inv.name.toLowerCase().includes(query) ||
      inv.filename.toLowerCase().includes(query);

    const verdict = inv.assessment?.verdict || '';
    let matchesFilter = true;
    if (selectedFilter === 'TRUSTED') {
      matchesFilter = verdict === 'TRUSTED' || verdict === 'PROBABLY TRUSTED';
    } else if (selectedFilter === 'MANIPULATED') {
      matchesFilter = verdict === 'MANIPULATED' || verdict === 'PROBABLY MANIPULATED';
    } else if (selectedFilter === 'UNCERTAIN') {
      matchesFilter = verdict === 'UNCERTAIN';
    }

    return matchesSearch && matchesFilter;
  });

  const totalCount = investigations.length;
  const trustedCount = investigations.filter((i) => i.assessment?.verdict?.includes('TRUSTED')).length;
  const manipulatedCount = investigations.filter((i) => i.assessment?.verdict?.includes('MANIPULATED')).length;
  const uncertainCount = investigations.filter((i) => i.assessment?.verdict === 'UNCERTAIN').length;

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'TRUSTED':
        return <Badge variant="match" size="sm">TRUSTED</Badge>;
      case 'PROBABLY TRUSTED':
        return <Badge variant="match" size="sm">PROBABLY TRUSTED</Badge>;
      case 'UNCERTAIN':
        return <Badge variant="uncertainty" size="sm">UNCERTAIN</Badge>;
      case 'PROBABLY MANIPULATED':
        return <Badge variant="conflict" size="sm">PROBABLY MANIPULATED</Badge>;
      case 'MANIPULATED':
        return <Badge variant="conflict" size="sm">MANIPULATED</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{verdict}</Badge>;
    }
  };

  return (
    <TrustLayerShell
      title="Investigation History"
      breadcrumbs={[{ label: 'INVESTIGATIONS' }]}
      maxWidth="1200px"
    >
      {/* 1. HEADER SECTION */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--tl-primary)',
              letterSpacing: '0.08em',
              fontWeight: 600,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            FORENSIC ARCHIVE & CASE RECORDS
          </span>
          <h1
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: 0,
              letterSpacing: '-0.025em',
            }}
          >
            Investigation Archive
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigate('/investigation/new')}
        >
          New Investigation
        </Button>
      </div>

      {/* 2. SUMMARY METRICS STRIP */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
            TOTAL ARCHIVED CASES
          </span>
          <div style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-ink)', marginTop: '4px' }}>
            {totalCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-success)' }}>
            VERIFIED TRUSTED
          </span>
          <div style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-success)', marginTop: '4px' }}>
            {trustedCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-error)' }}>
            FLAGGED MANIPULATED
          </span>
          <div style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-error)', marginTop: '4px' }}>
            {manipulatedCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-accent-amber)' }}>
            UNCERTAIN / INSUFFICIENT
          </span>
          <div style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-accent-amber)', marginTop: '4px' }}>
            {uncertainCount}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search
            size={16}
            color="var(--tl-muted)"
            style={{ position: 'absolute', left: '12px', top: '12px' }}
          />
          <input
            type="text"
            placeholder="Search by case ID, title, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '36px',
              paddingRight: '12px',
              backgroundColor: 'var(--tl-canvas)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-md)',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--tl-ink)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'TRUSTED', 'MANIPULATED', 'UNCERTAIN'].map((flt) => (
            <button
              key={flt}
              onClick={() => setSelectedFilter(flt)}
              style={{
                background: selectedFilter === flt ? 'var(--tl-primary)' : 'var(--tl-surface-card)',
                color: selectedFilter === flt ? '#ffffff' : 'var(--tl-ink)',
                border: `1px solid ${selectedFilter === flt ? 'var(--tl-primary)' : 'var(--tl-hairline)'}`,
                borderRadius: 'var(--tl-radius-sm)',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {flt}
            </button>
          ))}
        </div>
      </div>

      {/* 4. EDITORIAL INVESTIGATIONS DATA TABLE */}
      {loading ? (
        <LoadingState message="Loading archived investigations..." />
      ) : (
        <div
          style={{
            backgroundColor: 'var(--tl-canvas)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-lg)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--tl-surface-card)',
                    borderBottom: '1px solid var(--tl-hairline)',
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--tl-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>Investigation / Subject</th>
                  <th style={{ padding: '14px 16px' }}>File Metadata</th>
                  <th style={{ padding: '14px 16px' }}>Date</th>
                  <th style={{ padding: '14px 16px' }}>Trust Assessment</th>
                  <th style={{ padding: '14px 16px' }}>Coverage</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestigations.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    onClick={() => navigate(`/investigation/${inv.id}`)}
                    style={{
                      borderBottom: idx < filteredInvestigations.length - 1 ? '1px solid var(--tl-hairline-soft)' : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 100ms ease',
                    }}
                    className="tl-table-row"
                  >
                    {/* Col 1: ID & Title */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tl-primary)' }}>
                          {inv.id}
                        </span>
                        {inv.isDemo && <Badge variant="neutral" size="xs">DEMO</Badge>}
                      </div>
                      <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', display: 'block', marginTop: '2px' }}>
                        {inv.name}
                      </span>
                    </td>

                    {/* Col 2: File Metadata */}
                    <td style={{ padding: '16px 16px', fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-body)' }}>
                      <span>{inv.filename}</span>
                      <span style={{ display: 'block', color: 'var(--tl-muted)', fontSize: '0.6875rem', marginTop: '2px' }}>
                        {inv.fileSize} • {inv.duration}
                      </span>
                    </td>

                    {/* Col 3: Date */}
                    <td style={{ padding: '16px 16px', fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-muted)' }}>
                      {new Date(inv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Col 4: Trust Assessment */}
                    <td style={{ padding: '16px 16px' }}>
                      {getVerdictBadge(inv.assessment?.verdict)}
                    </td>

                    {/* Col 5: Evidence Coverage */}
                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--tl-surface-card)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${inv.assessment?.evidenceCoverage || 0}%`,
                              backgroundColor: (inv.assessment?.evidenceCoverage || 0) > 80 ? 'var(--tl-accent-teal)' : 'var(--tl-accent-amber)',
                            }}
                          />
                        </div>
                        <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-ink)' }}>
                          {inv.assessment?.evidenceCoverage}%
                        </span>
                      </div>
                    </td>

                    {/* Col 6: Action */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/investigation/${inv.id}`);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--tl-primary)',
                          fontFamily: 'var(--tl-font-sans)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Open Case</span>
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvestigations.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'var(--tl-font-sans)', color: 'var(--tl-muted)' }}>
              No investigations match the current filter or search criteria.
            </div>
          )}
        </div>
      )}
    </TrustLayerShell>
  );
};
