package conf.switches

import conf.switches.Expiry.never

trait TXSwitches {
  val brazeSwitch = Switch(
    group = SwitchGroup.TX,
    "braze-switch",
    "If this switch is off, the Braze SDK will not be loaded.",
    owners = Owner.group(SwitchGroup.TX),
    safeState = Off,
    sellByDate = never,
    exposeClientSide = true,
  )

  val contentCardsSwitch = Switch(
    group = SwitchGroup.TX,
    "braze-content-cards",
    "Enables Braze content cards (which power header notifications)",
    owners = Owner.group(SwitchGroup.TX),
    safeState = Off,
    sellByDate = never,
    exposeClientSide = true,
  )
}
