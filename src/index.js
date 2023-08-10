/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Button, Modal, TabPanel, __experimentalHStack as HStack } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

// The store for handling the fetching of the post data.
import { STORE_NAME } from './store';

/**
 * Internal dependencies
 */
console.log("Loaded scripts for reveal-post-data")

registerPlugin( 'reveal-post-data-panel', {
	render: () => {
		const [ isModalOpen, setIsModalOpen ] = useState( false );
		const toggleModal = () => setIsModalOpen( ! isModalOpen );

		const postData = useSelect( ( select ) => {
			const { getPostData } = select( STORE_NAME );
			return getPostData( select( 'core/editor' ).getCurrentPostId() );
		} );
		return (
			<PluginDocumentSettingPanel
				name="reveal-post-data-panel"
				title="Post Data"
				className="reveal-post-data-panel"
			>
				<HStack>
					<Button variant="secondary" onClick={ toggleModal }>{ __( 'Show raw data', 'reveal-post-data' )}</Button>
					{ isModalOpen && (
						<Modal
							className="reveal-post-data-modal"
							title={ __( 'Raw post data', 'reveal-post-data' ) }
							onRequestClose={ toggleModal }
						>
							<TabPanel
								tabs={
									[
										{
											name: 'post',
											title: 'Post',
											className: 'post',
										},
										{
											name: 'taxonomy',
											title: 'Taxonomies',
											className: 'taxonomy',
										},
										{
											name: 'meta',
											title: 'Meta',
											className: 'meta',
										},
									]
								}
							>
								{ ( tab ) => (
									<>
										{ tab.name === 'post' && <PostTable data={ postData.post } /> }
										{ tab.name === 'taxonomy' && <TaxonomyTable data={ postData.taxonomy } /> }
										{ tab.name === 'meta' && <MetaTable data={ postData.meta } /> }
									</>
								) }
							</TabPanel>
						</Modal>
					) }
				</HStack>
			</PluginDocumentSettingPanel>
		)
		
	},
	icon: 'airplane' // or false if you do not need an icon
} );

const PostTable = ( { data } ) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{ Object.entries( data ).map( ( [ key, value ] ) => (
					<tr key={ key }>
						<td>{ key }</td>
						<td>{ JSON.stringify( value ) }</td>
					</tr>
				) ) }
			</tbody>
		</table>
	)
}

const TaxonomyTable = ( { data } ) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Taxonomy</th>
					<th>Terms</th>
				</tr>
			</thead>
			<tbody>
				{ Object.entries( data ).map( ( [ key, object ] ) => (
					<tr key={ key }>
						<td>{ object.label }</td>
						<td>{ object.terms.join( ',' ) }</td>
					</tr>
				) ) }
			</tbody>
		</table>
	)
}

const MetaTable = ( { data } ) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{ Object.entries( data ).map( ( [ key, value ] ) => (
					<tr key={ key }>
						<td>{ key }</td>
						<td>{ JSON.stringify( value ) }</td>
					</tr>
				) ) }
			</tbody>
		</table>
	)
}
