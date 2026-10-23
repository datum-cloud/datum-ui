import type { CSSProperties, ReactNode } from 'react'
import {
  colors,
  fontFiles,
  fonts,
  motion,
  palette,
  radius,
  radiusScale,
  spacing,
  typography,
} from '@datum-cloud/datum-ui-tokens'

const chrome = {
  foreground: 'var(--foreground, #111111)',
  muted: 'var(--muted, #f2f2f2)',
  border: 'var(--border, #dddddd)',
  accent: 'var(--primary, #555555)',
} as const

const sectionStyle: CSSProperties = {
  marginTop: '2.5rem',
}

const descriptionStyle: CSSProperties = {
  margin: '0.25rem 0 1rem',
  opacity: 0.7,
  fontSize: '0.875rem',
}

const codeStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.8125rem',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.375rem 0.75rem 0.375rem 0',
  borderBottom: `1px solid ${chrome.border}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  opacity: 0.7,
}

const tdStyle: CSSProperties = {
  padding: '0.375rem 0.75rem 0.375rem 0',
  borderBottom: `1px solid ${chrome.border}`,
  verticalAlign: 'middle',
}

function Section({ title, description, children }: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={descriptionStyle}>{description}</p>
      {children}
    </section>
  )
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 28,
        height: 18,
        borderRadius: 3,
        background: color,
        border: '1px solid rgba(0, 0, 0, 0.15)',
        verticalAlign: 'middle',
      }}
    />
  )
}

function Palette() {
  return (
    <Section
      title="Palette"
      description="Raw Figma colours. These are the base values the semantic roles point at."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {Object.entries(palette).map(([name, value]) => (
          <div key={name}>
            <div
              style={{
                height: 56,
                borderRadius: 6,
                background: value,
                border: '1px solid rgba(0, 0, 0, 0.15)',
              }}
            />
            <div style={{ ...codeStyle, marginTop: '0.375rem', wordBreak: 'break-word' }}>{name}</div>
            <div style={{ ...codeStyle, opacity: 0.6 }}>{value}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function SemanticColors() {
  return (
    <Section
      title="Semantic colours"
      description="Purpose tokens for both schemes. The dark column is the same role resolved in .dark."
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Token</th>
              <th style={thStyle}>Light</th>
              <th style={thStyle}>Dark</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(colors.light).map(([key, value]) => {
              const darkValue = colors.dark[key as keyof typeof colors.dark]

              return (
                <tr key={key}>
                  <td style={{ ...tdStyle, ...codeStyle }}>{key}</td>
                  <td style={tdStyle}>
                    <Swatch color={value} />
                    {' '}
                    <span style={codeStyle}>{value}</span>
                  </td>
                  <td style={tdStyle}>
                    <Swatch color={darkValue} />
                    {' '}
                    <span style={codeStyle}>{darkValue}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

function SpacingSection() {
  return (
    <Section
      title="Spacing"
      description="The px value behind each Tailwind step: spacing[4] is p-4 is 16px. Bars cap at 320px."
    >
      <div style={{ display: 'grid', gap: '0.375rem' }}>
        {Object.entries(spacing).map(([step, value]) => (
          <div
            key={step}
            style={{
              display: 'grid',
              gridTemplateColumns: '4.5rem minmax(0, 320px) 3.5rem',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={codeStyle}>{step}</span>
            <span
              style={{
                display: 'block',
                height: 12,
                borderRadius: 999,
                background: chrome.muted,
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: Math.min(value, 320),
                  borderRadius: 999,
                  background: chrome.accent,
                }}
              />
            </span>
            <span style={{ ...codeStyle, opacity: 0.7 }}>
              {value}
              px
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function RadiusSection() {
  const groups: Array<{ title: string, tokens: Record<string, number> }> = [
    { title: 'radius', tokens: radius },
    { title: 'radiusScale', tokens: radiusScale },
  ]

  return (
    <Section
      title="Radius"
      description="Figma radius tokens and the rounded-* scale datum-ui renders."
    >
      {groups.map(group => (
        <div key={group.title} style={{ marginBottom: '1.25rem' }}>
          <div style={{ ...codeStyle, marginBottom: '0.5rem', opacity: 0.7 }}>{group.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(group.tokens).map(([name, value]) => (
              <div key={name} style={{ width: 96 }}>
                <div
                  style={{
                    height: 64,
                    borderRadius: value,
                    border: `1px solid ${chrome.border}`,
                    background: chrome.muted,
                  }}
                />
                <div style={{ ...codeStyle, marginTop: '0.375rem' }}>{name}</div>
                <div style={{ ...codeStyle, opacity: 0.6 }}>
                  {value}
                  px
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

function TypographySection() {
  return (
    <Section
      title="Typography"
      description="Type scale in px as rendered at phone width, with the matching line heights."
    >
      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Object.entries(typography.sizes).map(([step, size]) => (
          <div
            key={step}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '0.5rem',
              borderBottom: `1px solid ${chrome.border}`,
              paddingBottom: '0.375rem',
            }}
          >
            <span style={{ fontSize: size.fontSize, lineHeight: `${size.lineHeight}px` }}>
              The quick brown fox
            </span>
            <span style={{ ...codeStyle, opacity: 0.7 }}>
              {step}
              {' — '}
              {size.fontSize}
              /
              {size.lineHeight}
              px
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '0.375rem' }}>
        {Object.entries(typography.weights).map(([name, weight]) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}
          >
            <span style={{ fontWeight: Number(weight) }}>The quick brown fox</span>
            <span style={{ ...codeStyle, opacity: 0.7 }}>
              {name}
              {' — '}
              {weight}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function MotionSection() {
  return (
    <Section
      title="Motion"
      description="Easing curves as cubic-bezier tuples and durations in milliseconds."
    >
      <div style={{ ...codeStyle, marginBottom: '0.5rem', opacity: 0.7 }}>easing</div>
      <table style={{ ...tableStyle, marginBottom: '1.5rem' }}>
        <thead>
          <tr>
            <th style={thStyle}>Token</th>
            <th style={thStyle}>Cubic-bezier</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(motion.easing).map(([name, tuple]) => (
            <tr key={name}>
              <td style={{ ...tdStyle, ...codeStyle }}>{name}</td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {`cubic-bezier(${tuple.join(', ')})`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ ...codeStyle, marginBottom: '0.5rem', opacity: 0.7 }}>duration</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Token</th>
            <th style={thStyle}>Milliseconds</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(motion.duration).map(([name, ms]) => (
            <tr key={name}>
              <td style={{ ...tdStyle, ...codeStyle }}>{name}</td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {ms}
                ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function FontsSection() {
  const rows = [
    ...Object.entries(fonts.sans).map(([weight, family]) => ({ role: `sans.${weight}`, family })),
    { role: 'title', family: fonts.title },
    { role: 'mono', family: fonts.mono },
  ]

  return (
    <Section
      title="Fonts"
      description="Family names the package exports, and the file that ships each one."
    >
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Family</th>
            <th style={thStyle}>File</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ role, family }) => {
            const file = fontFiles[family as keyof typeof fontFiles]

            return (
              <tr key={role}>
                <td style={{ ...tdStyle, ...codeStyle }}>{role}</td>
                <td style={{ ...tdStyle, ...codeStyle }}>{family}</td>
                <td style={{ ...tdStyle, ...codeStyle }}>{file ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Section>
  )
}

export function TokenPlayground() {
  return (
    <div style={{ maxWidth: '64rem', color: chrome.foreground }}>
      <Palette />
      <SemanticColors />
      <SpacingSection />
      <RadiusSection />
      <TypographySection />
      <MotionSection />
      <FontsSection />
    </div>
  )
}
