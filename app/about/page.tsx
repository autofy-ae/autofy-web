export default function AboutPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="hero" style={{ marginBottom: 24 }}>
        <h1>Two petrolheads. <span>One free lot.</span></h1>
        <p>
          Autofy wasn't built by a company. It was built by two people who never really grew out of
          being car kids.
        </p>
        <span className="swoosh"></span>
      </div>

      <div className="panel" style={{ maxWidth: 'none' }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink)', marginBottom: 18 }}>
          It started the way it does for a lot of us — hours on a PS2 and a PSP, memorizing car
          silhouettes before we could drive any of them. Then came Top Gear: not just the cars, but the
          way it was shot, the way three grown men could make an engine note feel like a punchline. That
          combination stuck. Somewhere in our teenage years we picked up cameras and started learning
          how to actually make that kind of thing ourselves — filming, editing, the whole language of
          production.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink)', marginBottom: 18 }}>
          Two of us, same obsession, different decade of it building up. At some point the car knowledge
          and the production instincts stopped being separate hobbies and started looking like something
          we could actually build. On the 1st of January, 2026, that became Autofy.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink)', marginBottom: 18 }}>
          We built the site we always wished existed — one that doesn't charge you to list a car you
          haven't even sold yet, one where "specification: GCC" isn't buried three menus deep, one that
          actually asks for your exact BHP number because we know some of you care. No commission. No
          listing fees. No middleman taking a cut of your sale. Just people, their cars, and a phone
          number to call.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink)', marginBottom: 0 }}>
          If you know exactly what an I6 sounds like versus a V8, if you've argued about drivetrain
          layouts with strangers online, if Top Gear reruns still hit different at 1am — this was built
          for you as much as it was built by us.
        </p>
      </div>
    </div>
  );
}
