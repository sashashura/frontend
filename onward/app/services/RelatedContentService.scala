package services

import common.Edition
import conf.switches.Switches.RelatedContentSwitch
import contentapi.ContentApiClient
import model.dotcomrendering.{OnwardCollectionResponse, Trail}
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

class RelatedContentService(contentApiClient: ContentApiClient)(implicit
    executionContext: ExecutionContext,
) {
  def fetch(edition: Edition, pageId: String, excludeTags: Seq[String])(implicit
      request: RequestHeader,
  ): Future[OnwardCollectionResponse] = {
    if (RelatedContentSwitch.isSwitchedOff) {
      Future.successful(
        OnwardCollectionResponse(
          heading = "Related content",
          trails = Nil,
        ),
      )
    } else {

      // doesn't like "tag" being an empty string - need to explicitly pass a None
      val tags: Option[String] = excludeTags.toList match {
        case Nil       => None
        case excluding => Some(excluding.map(t => s"-$t").mkString(","))
      }

      val response = contentApiClient.getResponse(
        contentApiClient
          .item(pageId, edition)
          .tag(tags)
          .showRelated(true),
      )

      val trails = response.map(
        _.relatedContent
          .getOrElse(Seq())
          .map(FaciaContentConvert.contentToFaciaContent)
          .map(Trail.pressedContentToTrail),
      )

      trails
        .map(trails =>
          OnwardCollectionResponse(
            heading = "Related content",
            trails = trails,
          ),
        )
    }
  }
}
