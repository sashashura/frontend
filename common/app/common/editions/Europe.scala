package common.editions

import java.util.Locale
import common._
import navigation.{EditionNavLinks, NavLinks}
import org.joda.time.DateTimeZone

object Europe
    extends Edition(
      id = "EUR",
      displayName = "Europe edition",
      timezone = DateTimeZone.forID("Europe/London"),
      locale = Locale.forLanguageTag("en"),
      networkFrontId = "europe",
      editionalisedSections = Seq(""), // only the home page
      navigationLinks = International.navigationLinks
    ) {

  implicit val EUR = Europe
}