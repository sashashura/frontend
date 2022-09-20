package controllers

import com.gu.contentapi.client.model.{ContentApiError, ItemQuery}
import common.{Edition, GuLogging, ImplicitControllerExecutionContext, JsonComponent}
import feed.MostReadAgent
import model.{ApplicationContext, Cached, RelatedContent, RelatedContentItem, Tag}
import model.dotcomrendering.{OnwardCollectionResponse, Trail}
import models.Series
import play.api.libs.ws.WSClient
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents, RequestHeader, Result}
import play.twirl.api.Html
import renderers.DotcomRenderingService
import services.{PopularInTagService, SeriesService}
import contentapi.ContentApiClient

import scala.concurrent.Future

class OnwardResponseController(
    ws: WSClient,
    remoteRenderer: DotcomRenderingService,
    popularInTagService: PopularInTagService,
    seriesService: SeriesService,
    mostReadAgent: MostReadAgent,
    val controllerComponents: ControllerComponents,
)(implicit context: ApplicationContext)
    extends BaseController
      with ImplicitControllerExecutionContext {

  def popularInTag(tag: String)(implicit request: RequestHeader): Future[OnwardCollectionResponse] = {
    val edition = Edition(request)
    val excludeTags = request.queryString.getOrElse("exclude-tag", Nil)
    val itemViewCounts = mostReadAgent.getViewCounts

    popularInTagService.fetch(edition, tag, excludeTags, itemViewCounts)
  }
  def popularInTagJson(tag: String): Action[AnyContent] =
    Action.async { implicit request =>
      popularInTag(tag) map renderJson
    }
  def popularInTagHtml(tag: String): Action[AnyContent] =
    Action.async { implicit request =>
      popularInTag(tag) flatMap renderHtml
    }

  private def renderJson(
      onwardsCollection: OnwardCollectionResponse,
  )(implicit request: RequestHeader): Result = Cached(600) {
      JsonComponent
        .fromWritable[OnwardCollectionResponse](onwardsCollection)(
          request,
          OnwardCollectionResponse.collectionWrites,
      )
  }

  private def renderHtml(
      onwardsCollection: OnwardCollectionResponse,
  )(implicit request: RequestHeader): Future[Result] = {
    remoteRenderer.getOnward(ws, onwardsCollection) map { result =>
      Cached(600)(JsonComponent("html" -> new Html(result)))
    }
  }

  def series(seriesId: String)(implicit request: RequestHeader): Future[Option[OnwardCollectionResponse]] = {
    val edition = Edition(request)
    seriesService.fetch(edition, seriesId, decideReturnType = (tag, trails) =>
      OnwardCollectionResponse(
      heading = tag.id,
      trails = trails.map(_.faciaContent).map(Trail.pressedContentToTrail),
    ))
  }

  def seriesJson(seriesId: String): Action[AnyContent] =
    Action.async { implicit request =>
      series(seriesId).map { _.map(renderJson).getOrElse(NotFound) }
    }

    def seriesHtml(seriesId: String): Action[AnyContent] =
      Action.async { implicit request =>
        series(seriesId).flatMap {
          _.map(renderHtml).getOrElse(Future.successful(NotFound))
      }
    }
}
