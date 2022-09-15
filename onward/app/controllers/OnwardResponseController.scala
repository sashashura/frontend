package controllers

import common.{Edition, ImplicitControllerExecutionContext, JsonComponent}
import feed.MostReadAgent
import model.{ApplicationContext, Cached}
import model.dotcomrendering.OnwardCollectionResponse
import play.api.libs.ws.WSClient
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents, RequestHeader, Result}
import play.twirl.api.Html
import renderers.DotcomRenderingService
import services.{PopularInTagService, RelatedContentService}

import scala.concurrent.Future

class OnwardResponseController(
    ws: WSClient,
    remoteRenderer: DotcomRenderingService,
    popularInTagService: PopularInTagService,
    relatedContentService: RelatedContentService,
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

  def relatedContent(pageId: String)(implicit request: RequestHeader): Future[OnwardCollectionResponse] = {
    val edition = Edition(request)
    val excludeTags = request.queryString.getOrElse("exclude-tag", Nil)

    relatedContentService.fetch(edition, pageId, excludeTags)
  }

  def popularInTagJson(tag: String): Action[AnyContent] =
    Action.async { implicit request =>
      popularInTag(tag) flatMap renderJson
    }

  def popularInTagHtml(tag: String): Action[AnyContent] =
    Action.async { implicit request =>
      popularInTag(tag) flatMap renderHtml
    }

  def relatedContentJson(pageId: String): Action[AnyContent] =
    Action.async { implicit request =>
      relatedContent(pageId) flatMap renderJson
    }

  def relatedContentHtml(pageId: String): Action[AnyContent] =
    Action.async { implicit request =>
      relatedContent(pageId) flatMap renderHtml
    }

  private def renderJson(
      onwardsCollection: OnwardCollectionResponse,
  )(implicit request: RequestHeader): Future[Result] = {
    Future.successful(Cached(600) {
      JsonComponent
        .fromWritable[OnwardCollectionResponse](onwardsCollection)(
          request,
          OnwardCollectionResponse.collectionWrites,
        )
    })
  }

  private def renderHtml(
      onwardsCollection: OnwardCollectionResponse,
  )(implicit request: RequestHeader): Future[Result] = {
    remoteRenderer.getOnward(ws, onwardsCollection) map { result =>
      Cached(600)(JsonComponent("html" -> new Html(result)))
    }
  }
}
