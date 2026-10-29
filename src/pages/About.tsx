import { Check, Eye, GraduationCap, Handshake, ShieldCheck, Target, Zap } from 'lucide-react'
import { PageHero, CtaBand, SectionHead } from '../components/ui'
import { roadmap } from '../data/content'
import founderPhoto from '../assets/founder.png'
import { useI18n } from '../i18n'

export default function About() {
  const { t } = useI18n()
  const values = [
    { icon: ShieldCheck, title: t('about.v1.title'), text: t('about.v1.text') },
    { icon: Zap, title: t('about.v2.title'), text: t('about.v2.text') },
    { icon: Handshake, title: t('about.v3.title'), text: t('about.v3.text') },
  ]

  return (
    <>
      <PageHero
        eyebrow={t('about.eyebrow')}
        title={
          <>
            {t('about.title')} <span className="accent">{t('about.accent')}</span>
          </>
        }
        text={t('about.text')}
      />

      <section className="section--tight">
        <div className="container grid grid--2">
          <div className="card mission">
            <span className="mission__icon">
              <Target size={24} />
            </span>
            <h3>{t('about.mission')}</h3>
            <p>{t('about.missionText')}</p>
          </div>
          <div className="card mission">
            <span className="mission__icon mission__icon--green">
              <Eye size={24} />
            </span>
            <h3>{t('about.goal')}</h3>
            <p>{t('about.goalText')}</p>
          </div>
        </div>
        <div className="container grid grid--3 values">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="value">
                <Icon size={22} />
                <div>
                  <strong>{v.title}</strong>
                  <p>{v.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHead
            eyebrow={t('about.roadmap')}
            title={
              <>
                {t('about.roadmapTitle')} <span className="accent">{t('about.roadmapAccent')}</span>
              </>
            }
          />
          <ol className="roadmap">
            {roadmap.map((r, i) => (
              <li key={r.title} className={`roadmap__item roadmap__item--${i % 2 ? 'green' : 'blue'}`}>
                <div className="roadmap__head">
                  <span className="num-badge">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{t(r.title)}</h3>
                    <span className="roadmap__period">{t(r.period)}</span>
                  </div>
                </div>
                <ul className="check-list">
                  {r.items.map((it) => (
                    <li key={it}>
                      <Check size={16} /> {t(it)}
                    </li>
                  ))}
                </ul>
                <div className="roadmap__result">{t('about.result', { n: t(r.result) })}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="founder">
            <div className="founder__frame">
              <img
                className="founder__photo"
                src={founderPhoto}
                alt="Oydinoy Abdulazizova"
                width={520}
                height={684}
                loading="lazy"
              />
            </div>
            <div>
              <span className="eyebrow">{t('about.founder')}</span>
              <h3>Oydinoy Abdulazizova</h3>
              <p className="founder__role">
                <GraduationCap size={17} />
                <span>{t('about.founderRole')}</span>
              </p>
              <p className="muted">{t('about.founderNote')}</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
